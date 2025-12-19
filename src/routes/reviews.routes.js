import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { Review } from "../models/Review.js";

export const reviewsRoutes = Router();

reviewsRoutes.get("/parts/:partId/reviews", async (req, res) => {
  const items = await Review.find({ partId: req.params.partId, status: "VISIBLE" })
    .populate("userId", "name")
    .sort({ createdAt: -1 });
  res.json(items);
});

reviewsRoutes.post("/parts/:partId/reviews", auth, async (req, res) => {
  const { rating, text } = req.body;
  const created = await Review.create({
    partId: req.params.partId,
    userId: req.user.id,
    rating,
    text
  });
  res.status(201).json(created);
});

reviewsRoutes.patch("/reviews/:id/status", auth, requireRole("ADMIN"), async (req, res) => {
  const { status } = req.body; // VISIBLE/HIDDEN
  const updated = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(updated);
});

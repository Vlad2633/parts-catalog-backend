import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { Brand } from "../models/Brand.js";

export const brandsRoutes = Router();

brandsRoutes.get("/", async (req, res) => {
  const items = await Brand.find().sort({ name: 1 });
  res.json(items);
});

brandsRoutes.post("/", auth, requireRole("ADMIN"), async (req, res) => {
  const { name, slug } = req.body;
  const created = await Brand.create({ name, slug });
  res.status(201).json(created);
});

brandsRoutes.put("/:id", auth, requireRole("ADMIN"), async (req, res) => {
  const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

brandsRoutes.delete("/:id", auth, requireRole("ADMIN"), async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

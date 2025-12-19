import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { Category } from "../models/Category.js";

export const categoriesRoutes = Router();

categoriesRoutes.get("/", async (req, res) => {
  const items = await Category.find().sort({ name: 1 });
  res.json(items);
});

categoriesRoutes.post("/", auth, requireRole("ADMIN"), async (req, res) => {
  const { name, slug } = req.body;
  const created = await Category.create({ name, slug });
  res.status(201).json(created);
});

categoriesRoutes.put("/:id", auth, requireRole("ADMIN"), async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

categoriesRoutes.delete("/:id", auth, requireRole("ADMIN"), async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

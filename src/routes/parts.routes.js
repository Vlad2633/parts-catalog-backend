import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { Part } from "../models/Part.js";

export const partsRoutes = Router();

/**
 * GET /api/parts?q=&category=&brand=&minPrice=&maxPrice=&inStock=&page=&limit=
 */
partsRoutes.get("/", async (req, res) => {
  const {
    q,
    category,
    brand,
    minPrice,
    maxPrice,
    inStock,
    page = 1,
    limit = 12
  } = req.query;

  const filter = {};

  if (q) filter.title = { $regex: q, $options: "i" };
  if (category) filter.categoryId = category;
  if (brand) filter.brandId = brand;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (inStock === "true") filter.inStock = true;
  if (inStock === "false") filter.inStock = false;

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Part.find(filter)
      .populate("categoryId", "name slug")
      .populate("brandId", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Part.countDocuments(filter)
  ]);

  res.json({
    items,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / Number(limit))
  });
});

partsRoutes.get("/:id", async (req, res) => {
  const item = await Part.findById(req.params.id)
    .populate("categoryId", "name slug")
    .populate("brandId", "name slug");
  if (!item) return res.status(404).json({ message: "Запчастину не знайдено" });
  res.json(item);
});

partsRoutes.post("/", auth, requireRole("ADMIN"), async (req, res) => {
  const created = await Part.create(req.body);
  res.status(201).json(created);
});

partsRoutes.put("/:id", auth, requireRole("ADMIN"), async (req, res) => {
  const updated = await Part.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

partsRoutes.delete("/:id", auth, requireRole("ADMIN"), async (req, res) => {
  await Part.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

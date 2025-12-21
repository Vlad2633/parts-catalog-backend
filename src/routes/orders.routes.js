import { Router } from "express";
import Order from "../models/Order.js";

const router = Router();

function genOrderNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${y}${m}${day}-${rand}`;
}

// Публічне створення 
router.post("/", async (req, res, next) => {
  try {
    const { customer, comment, items, totalSum } = req.body;

    if (!customer?.fullName || !customer?.phone || !customer?.address)
      return res.status(400).json({ message: "Некоректні дані клієнта" });

    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Корзина порожня" });

    const order = await Order.create({
      orderNumber: genOrderNumber(),
      customer,
      comment: comment || "",
      items,
      totalSum,
    });

    return res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

export default router;

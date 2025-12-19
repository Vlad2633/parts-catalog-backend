import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { auth } from "../middleware/auth.js";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  body("name").isLength({ min: 2, max: 60 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 50 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Некоректні дані", errors: errors.array() });

    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email вже використовується" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  }
);

authRoutes.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 50 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Некоректні дані", errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Невірний email або пароль" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Невірний email або пароль" });

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  }
);

authRoutes.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("_id name email role createdAt");
  res.json(user);
});

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRoutes } from "./routes/auth.routes.js";
import { categoriesRoutes } from "./routes/categories.routes.js";
import { brandsRoutes } from "./routes/brands.routes.js";
import { partsRoutes } from "./routes/parts.routes.js";
import { reviewsRoutes } from "./routes/reviews.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.use("/api/auth", authRoutes);
  app.use("/api/categories", categoriesRoutes);
  app.use("/api/brands", brandsRoutes);
  app.use("/api/parts", partsRoutes);
  app.use("/api", reviewsRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

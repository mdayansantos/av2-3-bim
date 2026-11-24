import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import storeRoutes from "./routes/stores.routes.js";
import userRoutes from "./routes/users.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import openApiDocument from "./openapi.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",").map((value) => value.trim()) || "*",
    }),
  );
  app.use(express.json({ limit: "16kb" }));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );

  app.get("/", (_req, res) => {
    res.json({ status: "ok", name: "marketplace-api" });
  });
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/stores", storeRoutes);
  app.use("/products", productRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

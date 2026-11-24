import jwt from "jsonwebtoken";
import { AppError } from "./error.middleware.js";

export function requireAuth(req, _res, next) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication required", "UNAUTHORIZED");
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError(500, "Server authentication is not configured", "SERVER_ERROR");
  }

  try {
    const token = authorization.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch {
    throw new AppError(401, "Invalid or expired authentication token", "UNAUTHORIZED");
  }
}

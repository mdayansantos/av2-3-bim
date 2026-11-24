import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db.js";
import { AppError } from "../middleware/error.middleware.js";

const publicUser = {
  id: true,
  name: true,
  email: true,
};

export async function register(req, res) {
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await prisma.user.create({
    data: { ...req.body, password: passwordHash },
    select: publicUser,
  });
  res.status(201).json({ user });
}

export async function login(req, res) {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }
  if (!process.env.JWT_SECRET) {
    throw new AppError(500, "Server authentication is not configured", "SERVER_ERROR");
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { ...publicUser, stores: { include: { products: true } } },
  });
  if (!user) throw new AppError(404, "User not found", "NOT_FOUND");
  res.json({ user });
}

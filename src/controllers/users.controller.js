import bcrypt from "bcryptjs";
import prisma from "../db.js";
import { AppError } from "../middleware/error.middleware.js";

const publicUser = { id: true, name: true, email: true };

export async function listUsers(req, res) {
  const { page, limit } = req.query;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: publicUser,
      orderBy: { id: "asc" },
    }),
    prisma.user.count(),
  ]);

  res.json({ data: users, pagination: { page, limit, total } });
}

export async function getUser(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: publicUser,
  });
  if (!user) throw new AppError(404, "User not found", "NOT_FOUND");
  res.json({ user });
}

export async function updateUser(req, res) {
  if (req.params.id !== req.user.id) {
    throw new AppError(403, "You can only update your own account", "FORBIDDEN");
  }

  const data = { ...req.body };
  if (data.password) data.password = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data,
    select: publicUser,
  });
  res.json({ user });
}

export async function deleteUser(req, res) {
  if (req.params.id !== req.user.id) {
    throw new AppError(403, "You can only delete your own account", "FORBIDDEN");
  }
  await prisma.user.delete({ where: { id: req.user.id } });
  res.status(204).send();
}

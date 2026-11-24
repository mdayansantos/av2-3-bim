import prisma from "../db.js";
import { AppError } from "../middleware/error.middleware.js";

export async function listStores(req, res) {
  const { page, limit } = req.query;
  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { id: "asc" },
    }),
    prisma.store.count(),
  ]);
  res.json({ data: stores, pagination: { page, limit, total } });
}

export async function getStore(req, res) {
  const store = await prisma.store.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      products: true,
    },
  });
  if (!store) throw new AppError(404, "Store not found", "NOT_FOUND");
  res.json({ store });
}

export async function createStore(req, res) {
  const store = await prisma.store.create({
    data: { name: req.body.name, userId: req.user.id },
  });
  res.status(201).json({ store });
}

export async function updateStore(req, res) {
  const store = await prisma.store.findUnique({ where: { id: req.params.id } });
  if (!store) throw new AppError(404, "Store not found", "NOT_FOUND");
  if (store.userId !== req.user.id) {
    throw new AppError(403, "You can only update your own stores", "FORBIDDEN");
  }
  const updated = await prisma.store.update({
    where: { id: req.params.id },
    data: { name: req.body.name },
  });
  res.json({ store: updated });
}

export async function deleteStore(req, res) {
  const store = await prisma.store.findUnique({ where: { id: req.params.id } });
  if (!store) throw new AppError(404, "Store not found", "NOT_FOUND");
  if (store.userId !== req.user.id) {
    throw new AppError(403, "You can only delete your own stores", "FORBIDDEN");
  }
  await prisma.store.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

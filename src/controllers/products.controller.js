import prisma from "../db.js";
import { AppError } from "../middleware/error.middleware.js";

export async function listProducts(req, res) {
  const { page, limit } = req.query;
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { store: { include: { user: { select: { id: true, name: true } } } } },
      orderBy: { id: "asc" },
    }),
    prisma.product.count(),
  ]);
  res.json({ data: products, pagination: { page, limit, total } });
}

export async function getProduct(req, res) {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { store: { include: { user: { select: { id: true, name: true } } } } },
  });
  if (!product) throw new AppError(404, "Product not found", "NOT_FOUND");
  res.json({ product });
}

async function requireStoreOwner(storeId, userId) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw new AppError(404, "Store not found", "NOT_FOUND");
  if (store.userId !== userId) {
    throw new AppError(403, "You can only manage products in your own stores", "FORBIDDEN");
  }
  return store;
}

export async function createProduct(req, res) {
  await requireStoreOwner(req.body.storeId, req.user.id);
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json({ product });
}

export async function updateProduct(req, res) {
  const existing = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { store: true },
  });
  if (!existing) throw new AppError(404, "Product not found", "NOT_FOUND");
  if (existing.store.userId !== req.user.id) {
    throw new AppError(403, "You can only update products in your own stores", "FORBIDDEN");
  }
  if (req.body.storeId !== undefined) {
    await requireStoreOwner(req.body.storeId, req.user.id);
  }
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ product });
}

export async function deleteProduct(req, res) {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { store: true },
  });
  if (!product) throw new AppError(404, "Product not found", "NOT_FOUND");
  if (product.store.userId !== req.user.id) {
    throw new AppError(403, "You can only delete products from your own stores", "FORBIDDEN");
  }
  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8).max(72),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1).max(72),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      email: z.email().trim().toLowerCase().optional(),
      password: z.string().min(8).max(72).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
});

export const createStoreSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
  }),
});

export const updateStoreSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    name: z.string().trim().min(2).max(100),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(150),
    price: z.coerce.number().finite().nonnegative(),
    storeId: z.coerce.number().int().positive(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z
    .object({
      name: z.string().trim().min(2).max(150).optional(),
      price: z.coerce.number().finite().nonnegative().optional(),
      storeId: z.coerce.number().int().positive().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
});

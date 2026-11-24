import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../controllers/products.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createProductSchema,
  idParamSchema,
  paginationSchema,
  updateProductSchema,
} from "../validation/schemas.js";

const router = Router();

router.get("/", validate(paginationSchema), listProducts);
router.get("/:id", validate(idParamSchema), getProduct);
router.post("/", requireAuth, validate(createProductSchema), createProduct);
router.put("/:id", requireAuth, validate(updateProductSchema), updateProduct);
router.delete("/:id", requireAuth, validate(idParamSchema), deleteProduct);

export default router;

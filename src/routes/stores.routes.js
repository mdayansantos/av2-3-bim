import { Router } from "express";
import {
  createStore,
  deleteStore,
  getStore,
  listStores,
  updateStore,
} from "../controllers/stores.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createStoreSchema,
  idParamSchema,
  paginationSchema,
  updateStoreSchema,
} from "../validation/schemas.js";

const router = Router();

router.get("/", validate(paginationSchema), listStores);
router.get("/:id", validate(idParamSchema), getStore);
router.post("/", requireAuth, validate(createStoreSchema), createStore);
router.put("/:id", requireAuth, validate(updateStoreSchema), updateStore);
router.delete("/:id", requireAuth, validate(idParamSchema), deleteStore);

export default router;

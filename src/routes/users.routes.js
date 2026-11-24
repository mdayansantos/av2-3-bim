import { Router } from "express";
import {
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  idParamSchema,
  paginationSchema,
  updateUserSchema,
} from "../validation/schemas.js";

const router = Router();

router.get("/", requireAuth, validate(paginationSchema), listUsers);
router.get("/:id", requireAuth, validate(idParamSchema), getUser);
router.put("/:id", requireAuth, validate(updateUserSchema), updateUser);
router.delete("/:id", requireAuth, validate(idParamSchema), deleteUser);

export default router;

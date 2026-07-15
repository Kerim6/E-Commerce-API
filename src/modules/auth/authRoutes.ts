import { Router } from "express";
import { validateRequest } from "../../middleware/validation.ts";
import { registeration, logingIn } from "./authController.ts";
import { loginUserSchema, registerUserSchema } from "./authValidator.ts";

const router = Router();

router.post(
  "/register",
  validateRequest("body", registerUserSchema),
  registeration,
);

router.post("/login", validateRequest("body", loginUserSchema), logingIn);

export default router;

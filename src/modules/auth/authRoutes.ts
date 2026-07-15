import { Router } from "express";
import { validateRequest } from "../../middleware/validation.ts";
import { registeration } from "./authController.ts";
import { registerUserSchema } from "./authValidator.ts";

const router = Router();

router.post(
  "/register",
  validateRequest("body", registerUserSchema),
  registeration,
);

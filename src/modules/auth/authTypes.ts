import { registerUserSchema, loginUserSchema } from "./authValidator.ts";
import { z } from "zod";

export type RegisterInput = z.infer<typeof registerUserSchema>;

export type loginInput = z.infer<typeof loginUserSchema>;

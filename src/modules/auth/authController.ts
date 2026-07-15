import type { Request, Response } from "express";
import { register } from "./authService.ts";

export const registeration = async (req: Request, res: Response) => {
  const user = await register(req.body);

  return res.status(201).json(user);
};

import type { Request, Response, NextFunction } from "express";
import { verifyToken, type jwtPayload } from "../utils/jwt.ts";
import { UnauthorizedError } from "../errors/UnauthorizedError.ts";
import { ForbiddenError } from "../errors/ForbiddenError.ts";
import type { Role } from "../db/schema/users.ts";

export interface AuthenticatedRequest<
  P = any,
  B = any,
  Q = any,
> extends Request<P, B, Q> {
  user?: jwtPayload;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Authorization token is missing");
    }

    const payload = await verifyToken(token);
    req.user = payload;
    next();
  } catch (e) {
    throw new ForbiddenError("Invalid or expired token");
  }
};

export const authorize = (...alowedRoles: Role[]) => {
  const normalizedRoles = alowedRoles.map((role) => role.toLowerCase());

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const userRole = req.user?.role;

    if (!userRole) {
      throw new ForbiddenError("Role missing");
    }

    if (
      normalizedRoles.length > 0 &&
      !normalizedRoles.includes(userRole.toLowerCase())
    ) {
      throw new ForbiddenError("Forbbiden");
    }

    next();
  };
};

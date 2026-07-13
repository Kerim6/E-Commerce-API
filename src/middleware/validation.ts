import type { Request, Response, NextFunction } from "express";
// import type { ZodSchema } from "zod";
import { ZodType, ZodError } from "zod";

// Define a type for the allowed request properties that can be validated
type RequestTarget = "body" | "query" | "params";

// validate request body, query, or params against a Zod schema
export function validateRequest(target: RequestTarget, schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req[target] = schema.parse(req[target]);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Dynamic error message based on the targeted property (body, query, or params)
        const contextMessage: Record<RequestTarget, string> = {
          body: "Request body validation failed",
          query: "Query parameters validation failed",
          params: "URL parameters validation failed",
        };
        return res.status(400).json({
          error: contextMessage[target],
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      return next(error);
    }
  };
}

import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responseHandler";

export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log stack only in development
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  errorResponse(res, statusCode, message);
};

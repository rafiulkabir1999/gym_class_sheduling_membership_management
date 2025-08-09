import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  const errorDetails = err.errorDetails || undefined;

  return res.status(status).json({
    success: false,
    message,
    errorDetails
  });
}

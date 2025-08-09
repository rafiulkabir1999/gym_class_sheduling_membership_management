import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../../utils/jwt";

export interface AuthRequest extends Request {
  user?: any;
}

export function jwtMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access.",
      errorDetails: "Missing or malformed token."
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyJwt<{ id: number; role: string }>(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access.",
      errorDetails: "Invalid token."
    });
  }
}

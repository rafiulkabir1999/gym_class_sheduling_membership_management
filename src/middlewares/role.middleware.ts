import { Request, Response, NextFunction } from "express";

export const requireRole = (roles: string[]) => (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access.",
      errorDetails: "No user in request."
    });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access.",
      errorDetails: `You must be ${roles.join(" or ")} to perform this action.`
    });
  }
  next();
};

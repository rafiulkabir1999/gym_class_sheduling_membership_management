import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  // return req;
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Validation error occurred.",
        errorDetails: { field: "body", message: "Email, password and name are required." }
      });
    }
    const user = await authService.registerUser({ email, password, name });
    res.status(201).json({ success: true, message: "User registered successfully", data: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Validation error occurred.",
        errorDetails: { field: "body", message: "Email and password are required." }
      });
    }
    const { user, token } = await authService.loginUser({ email, password });
    res.status(200).json({ success: true, message: "Login successful", data: { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } } });
  } catch (err) {
    next(err);
  }
}

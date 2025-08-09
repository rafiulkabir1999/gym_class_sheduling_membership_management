import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from './user.service';
import bcrypt from 'bcryptjs';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const user = await createUser({ name, email, password, role });
    res.status(201).json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

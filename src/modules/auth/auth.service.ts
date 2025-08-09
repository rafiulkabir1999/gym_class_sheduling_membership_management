import prisma from "../../prismaClient";
import bcrypt from "bcrypt";
import { signJwt } from "../../utils/jwt";

const SALT_ROUNDS = 10;

export async function registerUser({ email, password, name }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw { status: 400, message: "Email already exists." };
  }
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      role: "TRAINEE"
    }
  });
  return user;
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw { status: 401, message: "Invalid credentials." };
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw { status: 401, message: "Invalid credentials." };
  }
  const token = signJwt({ id: user.id, role: user.role });
  return { user, token };
}

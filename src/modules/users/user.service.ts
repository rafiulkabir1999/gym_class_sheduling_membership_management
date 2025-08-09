import prisma from '../../prismaClient';
import bcrypt from 'bcryptjs';

export interface IUserCreateInput {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'trainer' | 'trainee';
}

export const createUser = async (data: IUserCreateInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return user;
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

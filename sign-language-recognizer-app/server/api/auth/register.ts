import { defineEventHandler, readBody, createError } from 'h3';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ username: string; email: string; password: string }>(event);

    if (!body.username || !body.email || !body.password) {
      throw createError({ statusCode: 400, message: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: body.email } });

    if (existingUser) {
      throw createError({ statusCode: 409, message: 'Email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
      },
    });

    return { message: 'User registered successfully', user: { id: newUser.id, email: newUser.email } };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Registration failed' });
  }
});

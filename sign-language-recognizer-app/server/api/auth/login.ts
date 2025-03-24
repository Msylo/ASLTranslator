import { defineEventHandler, readBody, setCookie, createError } from 'h3';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody<{ email: string; password: string }>(event);

    if (!email || !password) {
      throw createError({ statusCode: 400, message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError({ statusCode: 401, message: 'Invalid credentials' });
    }

    // Create session in the db
    const session = await prisma.session.create({
      data: { userId: user.id },
    });

    // Sets session as cookie
    setCookie(event, 'auth_token', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return { message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Login failed' });
  }
});

import { defineEventHandler, readBody, getCookie, createError } from 'h3';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, 'auth_token');

    if (!sessionId) {
      throw createError({ statusCode: 401, message: 'Not authenticated' });
    }

    const session = await prisma.session.findUnique({ where: { id: sessionId } });

    if (!session) {
      throw createError({ statusCode: 401, message: 'Invalid session' });
    }

    const body = await readBody<{ username?: string; email?: string; password?: string }>(event);

    let updateData: { username?: string; email?: string; password?: string } = {};

    if (body.username) updateData.username = body.username;
    if (body.email) updateData.email = body.email;

    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    });

    return { message: 'Profile updated successfully', user: updatedUser };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Update failed' });
  }
});

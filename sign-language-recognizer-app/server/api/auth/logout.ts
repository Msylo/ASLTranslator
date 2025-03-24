import { defineEventHandler, deleteCookie, getCookie, createError } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, 'auth_token');

    if (!sessionId) {
      throw createError({ statusCode: 401, message: 'Not authenticated' });
    }

    await prisma.session.delete({ where: { id: sessionId } });

    deleteCookie(event, 'auth_token');

    return { message: 'Logged out successfully' };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Logout failed' });
  }
});

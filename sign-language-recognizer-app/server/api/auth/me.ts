import { defineEventHandler, getCookie } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, 'auth_token');
    if (!sessionId) {
      return { error: 'Not authenticated' };
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true }, 
    });

    if (!session || !session.user) {
      return { error: 'Invalid session' };
    }

    return {
      user: {
        id: session.user.id,
        username: session.user.username, 
        email: session.user.email,
      },
    };
  } catch (error) {
    return { error: 'Failed to fetch user' };
  }
});

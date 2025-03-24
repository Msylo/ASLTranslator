import { defineEventHandler, getRouterParam, createError } from 'h3';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const userId = Number(getRouterParam(event, 'id'));

    if (!userId) {
      throw createError({ statusCode: 400, message: 'User ID is required' });
    }

    // Fetch user info, only return non-deleted posts & replies
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        posts: {
          where: { status: { not: Status.DELETED } },
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            status: true, 
            category: { select: { id: true, name: true } }, 
          },
          orderBy: { createdAt: 'desc' },
        },
        replies: {
          where: { status: { not: Status.DELETED } },
          select: {
            id: true,
            content: true,
            createdAt: true,
            status: true,
            post: { select: { id: true, title: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw createError({ statusCode: 404, message: 'User not found' });
    }

    return { user };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Failed to retrieve user profile' });
  }
});

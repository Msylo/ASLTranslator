import { defineEventHandler, readBody, getCookie } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { title, content, categoryId } = body;
    const sessionId = getCookie(event, 'auth_token');

    if (!sessionId) {
      throw createError({ statusCode: 401, message: 'Unauthorized' });
    }

    const session = await prisma.session.findUnique({ where: { id: sessionId } });

    if (!session) {
      throw createError({ statusCode: 401, message: 'Session expired' });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw createError({ statusCode: 400, message: 'Invalid category' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.userId,
        categoryId,
      },
    });

    return { message: 'Post created successfully', post };
  } catch (error: any) {
    return createError({ statusCode: 500, message: error.message });
  }
});

import { defineEventHandler, getRouterParam } from 'h3';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const postId = Number(getRouterParam(event, 'id'));

    if (!postId) {
      throw createError({ statusCode: 400, message: 'Invalid post ID' });
    }

    const deletedPost = await prisma.post.update({
      where: { id: postId },
      data: { status: Status.DELETED },
    });

    return { message: 'Post marked as deleted', post: deletedPost };
  } catch (error: any) {
    return createError({ statusCode: 500, message: error.message });
  }
});

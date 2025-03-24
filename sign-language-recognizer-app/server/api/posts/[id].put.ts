import { defineEventHandler, readBody, getRouterParam } from 'h3';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const postId = Number(getRouterParam(event, 'id'));
    const { title, content } = await readBody(event);

    if (!postId || (!title && !content)) {
      throw createError({ statusCode: 400, message: 'Invalid data' });
    }

    // Check post status before updating
    const existingPost = await prisma.post.findUnique({ where: { id: postId } });

    if (!existingPost) {
      throw createError({ statusCode: 404, message: 'Post not found' });
    }

    if (existingPost.status === Status.DELETED || existingPost.status === Status.LOCKED) {
      throw createError({ statusCode: 403, message: 'This post cannot be updated' });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { title, content },
    });

    return { message: 'Post updated successfully', post: updatedPost };
  } catch (error: any) {
    return createError({ statusCode: 500, message: error.message });
  }
});

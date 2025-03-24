import { defineEventHandler, readBody, getCookie } from 'h3';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { postId, parentReplyId, content } = body;
    const sessionId = getCookie(event, 'auth_token');

    if (!sessionId) {
      throw createError({ statusCode: 401, message: 'Unauthorized' });
    }

    const session = await prisma.session.findUnique({ where: { id: sessionId } });

    if (!session) {
      throw createError({ statusCode: 401, message: 'Session expired' });
    }

    // Check if post exists and is not locked or deleted
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { status: true },
    });

    if (!post) {
      throw createError({ statusCode: 404, message: 'Post not found' });
    }

    if (post.status === Status.DELETED || post.status === Status.LOCKED) {
      throw createError({ statusCode: 403, message: 'Cannot reply to this post' });
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        authorId: session.userId,
        postId,
        parentReplyId,
      },
    });

    return { message: 'Reply posted successfully', reply };
  } catch (error: any) {
    return createError({ statusCode: 500, message: error.message });
  }
});

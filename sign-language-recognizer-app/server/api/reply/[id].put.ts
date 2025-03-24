import { defineEventHandler, readBody, getRouterParam } from 'h3';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const replyId = Number(getRouterParam(event, 'id'));
    const { content } = await readBody(event);

    if (!replyId || !content) {
      throw createError({ statusCode: 400, message: 'Invalid data' });
    }

    // Fetch reply status before updating
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      select: { status: true },
    });

    if (!reply) {
      throw createError({ statusCode: 404, message: 'Reply not found' });
    }

    if (reply.status === Status.DELETED || reply.status === Status.LOCKED) {
      throw createError({ statusCode: 403, message: 'Cannot edit a locked or deleted reply' });
    }

    const updatedReply = await prisma.reply.update({
      where: { id: replyId },
      data: { content },
    });

    return { message: 'Reply updated successfully', reply: updatedReply };
  } catch (error: any) {
    return createError({ statusCode: 500, message: error.message });
  }
});


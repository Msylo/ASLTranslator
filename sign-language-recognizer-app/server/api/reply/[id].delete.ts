import { defineEventHandler, getRouterParam } from 'h3';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const replyId = Number(getRouterParam(event, 'id'));

    if (!replyId) {
      throw createError({ statusCode: 400, message: 'Invalid reply ID' });
    }

    // Fetch reply status before deleting
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      select: { status: true },
    });

    if (!reply) {
      throw createError({ statusCode: 404, message: 'Reply not found' });
    }

    if (reply.status === Status.DELETED) {
      throw createError({ statusCode: 403, message: 'Reply is already deleted' });
    }

    if (reply.status === Status.LOCKED) {
      throw createError({ statusCode: 403, message: 'Cannot delete a locked reply' });
    }

    // Mark reply as deleted
    const deletedReply = await prisma.reply.update({
      where: { id: replyId },
      data: {
        content: 'This reply has been deleted',
        status: Status.DELETED,
      },
    });

    return { message: 'Reply marked as deleted', reply: deletedReply };
  } catch (error: any) {
    return createError({ statusCode: 500, message: error.message });
  }
});

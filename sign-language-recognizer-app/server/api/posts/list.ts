import { defineEventHandler } from 'h3';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const posts = await prisma.post.findMany({
      where: { status: { not: Status.DELETED } },
      include: {
        author: { select: { id: true, username: true } },
        category: { select: { id: true, name: true } }
      },
    });

    return { posts };
  } catch (error: any) {
    return createError({ statusCode: 500, message: error.message });
  }
});

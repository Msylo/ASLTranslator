import { defineEventHandler, createError } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return { categories };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});

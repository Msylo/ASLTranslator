import { defineEventHandler, createError, getRouterParam } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const categoryId = Number(getRouterParam(event, "id"));

    if (isNaN(categoryId)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid category ID" });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        posts: {
          include: {
            author: {
              select: {
                username: true,
              },
            },
            replies: true,
          },
        },
      },
    });

    if (!category) {
      throw createError({ statusCode: 404, statusMessage: "Category not found" });
    }

    return { category };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});

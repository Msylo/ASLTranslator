// import { defineEventHandler, getRouterParam } from 'h3';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default defineEventHandler(async (event) => {
//   const postId = getRouterParam(event, "id");

//   const post = await prisma.post.findUnique({
//     where: { id: Number(postId) },
//     include: {
//       author: { select: { id: true, username: true, createdAt: true } },
//       replies: {
//         where: { parentReplyId: null },
//         include: {
//           author: { select: { id: true, username: true, createdAt: true } },
//           childReplies: {
//             include: {
//               author: { select: { id: true, username: true, createdAt: true } },
//               childReplies: {
//                 include: {
//                   author: { select: { id: true, username: true, createdAt: true } },
//                 },
//               },
//             },
//           },
//         },
//         orderBy: { createdAt: "asc" },
//       },
//     },
//   });

//   if (!post) throw createError({ statusCode: 404, statusMessage: "Post not found" });

//   return post;
// });

import { defineEventHandler, getRouterParam } from 'h3';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const postId = Number(getRouterParam(event, "id"));

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, username: true, createdAt: true } },
      replies: {
        where: { parentReplyId: null, status: { not: Status.DELETED } }, 
        include: {
          author: { select: { id: true, username: true, createdAt: true } },
          childReplies: {
            where: { status: { not: Status.DELETED } },
            include: {
              author: { select: { id: true, username: true, createdAt: true } },
              childReplies: {
                where: { status: { not: Status.DELETED } },
                include: {
                  author: { select: { id: true, username: true, createdAt: true } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) throw createError({ statusCode: 404, statusMessage: "Post not found" });

  if (post.status === Status.DELETED) {
    return { id: post.id, status: post.status, message: "This post has been deleted." };
  }

  return post;
});


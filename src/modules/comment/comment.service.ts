import { CommentPost } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });
  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }
  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentsByPostId = async (id: string) => {
  return await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          title: true,
          content: true,
          views: true,
        },
      },
    },
  });
};

const getCommentsByAuthor = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const deleteComment = async (commentId: string, userId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: userId,
    },
  });
  if (!commentData) {
    throw new Error("You are not authorized to delete this comment");
  }
  return await prisma.comment.delete({
    where: {
      id: commentData.id
    }
  })
};


const updateComment = async (commentId: string, data: {content?: string, status?: CommentPost}, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true
    }
  })

  if (!commentData) {
    throw new Error("You are not authorized to update this comment");
  }
  return await prisma.comment.update({
    where: {
      id: commentId,
      authorId
    },
    data
  })
}

export const CommentService = {
  createComment,
  getCommentsByPostId,
  getCommentsByAuthor,
  deleteComment,
  updateComment
};

import { string } from "better-auth/*";
import {
  CommentPost,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags,
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({ isFeatured });
  }
  if (status) {
    andConditions.push({
      status,
    });
  }

  if (authorId) {
    andConditions.push({
      authorId,
    });
  }
  const allPost = await prisma.post.findMany({
    take: limit,
    skip: skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });
  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: allPost,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: { parentId: null },
          orderBy: { createdAt: "desc" },
          include: {
            replies: {
              // where: {},
              orderBy: { createdAt: "asc" },
              include: {
                replies: {
                  // where:{},
                  orderBy: { createdAt: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return postData;
  });
};

const getMyPosts = async (authorId: string) => {
  await prisma.user.findFirstOrThrow({
    where: {
      id: authorId,
    },
    select: {
      id: true,
    }
  })
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return result;
};


const updatePost = async (postId: string, data: Partial<Post>, authorId: string, isAdmin: boolean) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    }
  });
  if (!isAdmin && (postData.authorId !== authorId)) {
    throw new Error("You are not authorized to update this post");
  }

  if(!isAdmin){
    delete data.isFeatured;
  }
  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      ...data,
    },
  });
  return result;
}


const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    }
  });

  if (!isAdmin && (postData.authorId !== authorId)) {
    throw new Error("You are not authorized to delete this post");
  }
  const result = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return result;
};



const getStats = async () => {
 return await prisma.$transaction(async (tx) => {
  const [totalPosts, publishedPosts, draftPosts, archivedPosts, totalComments, approvedComments] = await Promise.all([
    tx.post.count(),
    tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
    tx.post.count({ where: { status: PostStatus.DRAFT } }),
    tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
    tx.comment.count(),
    tx.comment.count({where: {status: "APPROVED"}})
  ]);
   return {
    totalPosts,
    publishedPosts,
    draftPosts,
    archivedPosts,
    totalComments,
    approvedComments
  };
 });
};
 


export const postService = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats
};

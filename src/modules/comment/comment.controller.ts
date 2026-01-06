import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await CommentService.createComment(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: "comment creation failed",
      details: err,
    });
  }
};

const getCommentsById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await CommentService.getCommentsByPostId(
      commentId as string
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Fetching comments failed",
      details: error,
    });
  }
};


const getCommentsByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    console.log("authorId",authorId)
    const result = await CommentService.getCommentsByAuthor(
      authorId as string
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Fetching comments failed",
      details: error,
    });
  }
};


const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await CommentService.deleteComment(commentId as string, user?.id as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Fetching comments failed",
      details: error,
    });
  }
};
const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await CommentService.updateComment(commentId as string, req.body, user?.id as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Fetching comments failed",
      details: error,
    });
  }
};




export const CommentController = {
  createComment,
  getCommentsById,
  getCommentsByAuthor,
  deleteComment,
  updateComment
};

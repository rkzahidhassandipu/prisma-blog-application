import express, { Router} from "express"
import { CommentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();


router.get(
    "/author/:authorId",
    CommentController.getCommentsByAuthor
)
router.get(
    "/:commentId",
    CommentController.getCommentsById
)

router.post(
    "/",
    auth(UserRole.ADMIN, UserRole.USER),
    CommentController.createComment
)


router.delete(
    "/:commentId",
    auth(UserRole.ADMIN, UserRole.USER),
    CommentController.deleteComment
)

router.patch(
    "/:commentId",
    auth(UserRole.ADMIN, UserRole.USER),
    CommentController.updateComment
)


router.patch(
    "/:commentId/moderate",
    auth(UserRole.ADMIN),
    CommentController.moderateComment
)

export const commentRouter: Router = router;
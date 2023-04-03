import { Router } from 'express';

import CreatePostController from '@modules/posts/services/createPost/CreatePostController';
import ShowPostController from '@modules/posts/services/showPost/ShowPostController';
import ListPostController from '@modules/posts/services/listPost/ListPostController';
import UpdatePostController from '@modules/posts/services/updatePost/UpdatePostController';
import DeletePostController from '@modules/posts/services/deletePost/DeletePostController';
import CreateCommentController from '@modules/posts/services/createComment/CreateCommentController';
import ShowCommentController from '@modules/posts/services/showComment/ShowCommentController';
import ListCommentController from '@modules/posts/services/listComment/ListCommentController';
import UpdateCommentController from '@modules/posts/services/updateComment/UpdateCommentController';
import DeleteCommentController from '@modules/posts/services/deleteComment/DeleteCommentController';
import CreateAnswerController from '@modules/posts/services/createAnswer/CreateAnswerController';
import ShowAnswerController from '@modules/posts/services/showAnswer/ShowAnswerController';
import ListAnswerController from '@modules/posts/services/listAnswer/ListAnswerController';
import UpdateAnswerController from '@modules/posts/services/updateAnswer/UpdateAnswerController';
import DeleteAnswerController from '@modules/posts/services/deleteAnswer/DeleteAnswerController';
import uploadConfig from '@config/upload';
import multer from 'multer';

const postRouter = Router();
const upload = multer(uploadConfig.multer);
const createPostController = new CreatePostController();
const listPostController = new ListPostController();
const showPostController = new ShowPostController();
const updatePostController = new UpdatePostController();
const deletePostController = new DeletePostController();
const createCommentController = new CreateCommentController();
const listCommentController = new ListCommentController();
const showCommentController = new ShowCommentController();
const updateCommentController = new UpdateCommentController();
const deleteCommentController = new DeleteCommentController();
const createAnswerController = new CreateAnswerController();
const listAnswerController = new ListAnswerController();
const showAnswerController = new ShowAnswerController();
const updateAnswerController = new UpdateAnswerController();
const deleteAnswerController = new DeleteAnswerController();

postRouter.post('/posts/', upload.single('image'), createPostController.handle);
postRouter.get('/posts/', listPostController.handle);
postRouter.get('/posts/:id', showPostController.handle);
postRouter.put(
  '/posts/:id',
  upload.single('image'),
  updatePostController.handle,
);
postRouter.delete('/posts/:id', deletePostController.handle);

postRouter.post('/comments', createCommentController.handle);
postRouter.get('/comments', listCommentController.handle);
postRouter.get('/comments/:id', showCommentController.handle);
postRouter.put('/comments/:id', updateCommentController.handle);
postRouter.delete('/comments/:id', deleteCommentController.handle);

postRouter.post('/answers', createAnswerController.handle);
postRouter.get('/answers', listAnswerController.handle);
postRouter.get('/answers/:id', showAnswerController.handle);
postRouter.put('/answers/:id', updateAnswerController.handle);
postRouter.delete('/answers/:id', deleteAnswerController.handle);

export default postRouter;

import IPostDTO from '@modules/posts/dtos/IPostDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreatePostService from './CreatePostService';

export default class CreatePostController {
  async handle(request: Request, response: Response) {
    const postData: IPostDTO = request.body;
    postData.image = request.file?.filename;
    postData.user_id = request.user.id;

    const createPost = container.resolve(CreatePostService);

    const post = await createPost.execute(postData);

    return response.send(post);
  }
}

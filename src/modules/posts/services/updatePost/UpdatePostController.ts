import { Request, Response } from 'express';
import { container } from 'tsyringe';

import IPostDTO from '@modules/posts/dtos/IPostDTO';
import IObjectDTO from '@dtos/IObjectDTO';
import UpdatePostService from './UpdatePostService';

export default class UpdatePostController {
  async handle(request: Request, response: Response) {
    const updatePost = container.resolve(UpdatePostService);

    const postParam: IObjectDTO = request.params;
    const postData: IPostDTO = request.body;
    postData.image = request.file?.filename;

    const post = await updatePost.execute(postParam, postData);

    return response.send(post);
  }
}

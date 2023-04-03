import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeletePostService from './DeletePostService';

export default class DeletePostController {
  async handle(request: Request, response: Response) {
    const deletePost = container.resolve(DeletePostService);

    const postParam: IObjectDTO = request.params;

    const post = await deletePost.execute(postParam);

    return response.send(post);
  }
}

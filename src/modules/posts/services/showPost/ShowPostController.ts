import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowPostService from './ShowPostService';

export default class ShowPostController {
  async handle(request: Request, response: Response) {
    const showPost = container.resolve(ShowPostService);

    const postParam: IObjectDTO = request.params;

    const post = await showPost.execute(postParam);

    return response.send(post);
  }
}

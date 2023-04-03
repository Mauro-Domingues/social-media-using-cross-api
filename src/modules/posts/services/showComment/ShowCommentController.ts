import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowCommentService from './ShowCommentService';

export default class ShowCommentController {
  async handle(request: Request, response: Response) {
    const showComment = container.resolve(ShowCommentService);

    const commentParam: IObjectDTO = request.params;

    const comment = await showComment.execute(commentParam);

    return response.send(comment);
  }
}

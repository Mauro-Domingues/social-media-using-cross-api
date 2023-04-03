import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ICommentDTO from '@modules/posts/dtos/ICommentDTO';
import IObjectDTO from '@dtos/IObjectDTO';
import UpdateCommentService from './UpdateCommentService';

export default class UpdateCommentController {
  async handle(request: Request, response: Response) {
    const updateComment = container.resolve(UpdateCommentService);

    const commentParam: IObjectDTO = request.params;
    const commentData: ICommentDTO = request.body;

    const comment = await updateComment.execute(commentParam, commentData);

    return response.send(comment);
  }
}

import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteCommentService from './DeleteCommentService';

export default class DeleteCommentController {
  async handle(request: Request, response: Response) {
    const deleteComment = container.resolve(DeleteCommentService);

    const commentParam: IObjectDTO = request.params;

    const comment = await deleteComment.execute(commentParam);

    return response.send(comment);
  }
}

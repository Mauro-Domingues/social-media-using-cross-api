import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListAnswerService from './ListAnswerService';

export default class ListAnswerController {
  async handle(request: Request, response: Response) {
    const listAnswer = container.resolve(ListAnswerService);

    const { page = 1, limit = 20, comment_id } = request.query;

    const answers = await listAnswer.execute(
      Number(page),
      Number(limit),
      String(comment_id),
    );

    return response.send(answers);
  }
}

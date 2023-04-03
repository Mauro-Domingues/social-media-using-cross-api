import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteAnswerService from './DeleteAnswerService';

export default class DeleteAnswerController {
  async handle(request: Request, response: Response) {
    const deleteAnswer = container.resolve(DeleteAnswerService);

    const answerParam: IObjectDTO = request.params;

    const answer = await deleteAnswer.execute(answerParam);

    return response.send(answer);
  }
}

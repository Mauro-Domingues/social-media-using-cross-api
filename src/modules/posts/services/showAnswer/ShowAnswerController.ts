import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowAnswerService from './ShowAnswerService';

export default class ShowAnswerController {
  async handle(request: Request, response: Response) {
    const showAnswer = container.resolve(ShowAnswerService);

    const answerParam: IObjectDTO = request.params;

    const answer = await showAnswer.execute(answerParam);

    return response.send(answer);
  }
}

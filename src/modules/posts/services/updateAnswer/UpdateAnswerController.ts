import { Request, Response } from 'express';
import { container } from 'tsyringe';

import IAnswerDTO from '@modules/posts/dtos/IAnswerDTO';
import IObjectDTO from '@dtos/IObjectDTO';
import UpdateAnswerService from './UpdateAnswerService';

export default class UpdateAnswerController {
  async handle(request: Request, response: Response) {
    const updateAnswer = container.resolve(UpdateAnswerService);

    const answerParam: IObjectDTO = request.params;
    const answerData: IAnswerDTO = request.body;

    const answer = await updateAnswer.execute(answerParam, answerData);

    return response.send(answer);
  }
}

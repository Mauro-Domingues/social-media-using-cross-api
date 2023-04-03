import IAnswerDTO from '@modules/posts/dtos/IAnswerDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAnswerService from './CreateAnswerService';

export default class CreateAnswerController {
  async handle(request: Request, response: Response) {
    const answerData: IAnswerDTO = request.body;
    answerData.user_id = request.user.id;

    const createAnswer = container.resolve(CreateAnswerService);

    const answer = await createAnswer.execute(answerData);

    return response.send(answer);
  }
}

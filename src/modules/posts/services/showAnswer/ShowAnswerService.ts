import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IAnswersRepository from '@modules/posts/repositories/IAnswersRepository';
import Answer from '@modules/posts/entities/Answer';
import { instanceToInstance } from 'class-transformer';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';

@injectable()
export default class ShowAnswerService {
  constructor(
    @inject('AnswersRepository')
    private answersRepository: IAnswersRepository,
  ) {}

  async execute(answerParam: IObjectDTO): Promise<IResponseDTO<Answer>> {
    const answer = await this.answersRepository.findBy(answerParam, []);

    if (!answer) {
      throw new AppError('Answer not found', 404);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Answer found successfully',
      data: instanceToInstance(answer),
    };
  }
}

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IAnswersRepository from '@modules/posts/repositories/IAnswersRepository';
import IAnswerDTO from '@modules/posts/dtos/IAnswerDTO';
import mapAndUpdateAttribute from '@utils/mappers/mapAndUpdateAttribute';
import Answer from '@modules/posts/entities/Answer';
import { instanceToInstance } from 'class-transformer';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';

@injectable()
export default class UpdateAnswerService {
  constructor(
    @inject('AnswersRepository')
    private answersRepository: IAnswersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(
    answerParam: IObjectDTO,
    answerData: IAnswerDTO,
  ): Promise<IResponseDTO<Answer>> {
    const answer = await this.answersRepository.findBy(answerParam);

    if (!answer) {
      throw new AppError('Answer not found', 404);
    }

    await this.cacheProvider.invalidatePrefix('posts');
    await this.cacheProvider.invalidatePrefix('answers');
    await this.cacheProvider.invalidatePrefix('comments');

    await this.answersRepository.update(
      await mapAndUpdateAttribute(answer, answerData),
    );

    return {
      code: 200,
      message_code: 'OK',
      message: 'successfully updated answer',
      data: instanceToInstance(answer),
    };
  }
}

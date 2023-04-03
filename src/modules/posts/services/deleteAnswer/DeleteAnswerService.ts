import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAnswersRepository from '@modules/posts/repositories/IAnswersRepository';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';

@injectable()
export default class DeleteAnswerService {
  constructor(
    @inject('AnswersRepository')
    private answersRepository: IAnswersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(answerParam: IObjectDTO): Promise<IResponseDTO<null>> {
    const answer = await this.answersRepository.findBy(answerParam);

    if (!answer) {
      throw new AppError('Answer not found', 404);
    }

    await this.cacheProvider.invalidatePrefix('posts');
    await this.cacheProvider.invalidatePrefix('answers');
    await this.cacheProvider.invalidatePrefix('comments');

    this.answersRepository.delete(answer);

    return {
      code: 204,
      message_code: 'NO_CONTENT',
      message: 'successfully deleted answer',
      data: null,
    };
  }
}

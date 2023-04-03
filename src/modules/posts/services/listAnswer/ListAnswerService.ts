import { injectable, inject } from 'tsyringe';

import IAnswersRepository from '@modules/posts/repositories/IAnswersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Answer from '@modules/posts/entities/Answer';
import { instanceToInstance } from 'class-transformer';
import ICacheDTO from '@dtos/ICacheDTO';
import IListDTO from '@dtos/IListDTO';
import AppError from '@shared/errors/AppError';

@injectable()
export default class ListAnswerService {
  constructor(
    @inject('AnswersRepository')
    private answersRepository: IAnswersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(
    page: number,
    limit: number,
    comment_id: string,
  ): Promise<IListDTO<Answer>> {
    if (!comment_id || comment_id === 'undefined') {
      throw new AppError('Post not specified', 401);
    }

    const cacheKey = `answers:${page}:${limit}:${comment_id}`;

    let cache = await this.cacheProvider.recovery<ICacheDTO<Answer>>(cacheKey);

    if (!cache) {
      const { answers, amount } = await this.answersRepository.findAll(
        page,
        limit,
        { comment_id },
      );
      cache = { data: instanceToInstance(answers), total: amount };
      await this.cacheProvider.save(cacheKey, cache);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Answers found successfully',
      pagination: {
        total: cache.total,
        page,
        perPage: limit,
        lastPage: cache.total % limit,
      },
      data: cache.data,
    };
  }
}

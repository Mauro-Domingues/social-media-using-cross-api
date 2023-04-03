import { injectable, inject } from 'tsyringe';

import ICommentsRepository from '@modules/posts/repositories/ICommentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Comment from '@modules/posts/entities/Comment';
import { instanceToInstance } from 'class-transformer';
import ICacheDTO from '@dtos/ICacheDTO';
import IListDTO from '@dtos/IListDTO';
import AppError from '@shared/errors/AppError';

@injectable()
export default class ListCommentService {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(
    page: number,
    limit: number,
    post_id: string,
  ): Promise<IListDTO<Comment>> {
    if (!post_id || post_id === 'undefined') {
      throw new Error('Post not specified');
    }

    const cacheKey = `comments:${page}:${limit}:${post_id}`;

    let cache = await this.cacheProvider.recovery<ICacheDTO<Comment>>(cacheKey);

    if (!cache) {
      const { comments, amount } = await this.commentsRepository.findAll(
        page,
        limit,
        { post_id },
      );
      cache = { data: instanceToInstance(comments), total: amount };
      await this.cacheProvider.save(cacheKey, cache);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Comments found successfully',
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

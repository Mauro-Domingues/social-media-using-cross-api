import { injectable, inject } from 'tsyringe';

import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Post from '@modules/posts/entities/Post';
import { instanceToInstance } from 'class-transformer';
import ICacheDTO from '@dtos/ICacheDTO';
import IListDTO from '@dtos/IListDTO';

@injectable()
export default class ListPostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(
    page: number,
    limit: number,
    profile_id?: string,
  ): Promise<IListDTO<Post>> {
    const cacheKey = `posts:${page}:${limit}:${profile_id}`;

    let cache = await this.cacheProvider.recovery<ICacheDTO<Post>>(cacheKey);

    if (!cache) {
      const { posts, amount } = await this.postsRepository.findAll(
        page,
        limit,
        { profile_id },
      );
      cache = { data: instanceToInstance(posts), total: amount };
      await this.cacheProvider.save(cacheKey, cache);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Posts found successfully',
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

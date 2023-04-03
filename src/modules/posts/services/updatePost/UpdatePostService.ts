import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import IPostDTO from '@modules/posts/dtos/IPostDTO';
import mapAndUpdateAttribute from '@utils/mappers/mapAndUpdateAttribute';
import Post from '@modules/posts/entities/Post';
import { instanceToInstance } from 'class-transformer';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

@injectable()
export default class UpdatePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(
    postParam: IObjectDTO,
    postData: IPostDTO,
  ): Promise<IResponseDTO<Post>> {
    const post = await this.postsRepository.findBy(postParam);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    if (postData.image) {
      await this.storageProvider.deleteFile(post.image);
      await this.storageProvider.saveFile(postData.image);
    }

    await this.cacheProvider.invalidatePrefix('posts');

    await this.postsRepository.update(
      await mapAndUpdateAttribute(post, postData),
    );

    return {
      code: 200,
      message_code: 'OK',
      message: 'successfully updated post',
      data: instanceToInstance(post),
    };
  }
}

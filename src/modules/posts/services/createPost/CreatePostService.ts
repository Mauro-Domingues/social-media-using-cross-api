import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import IPostDTO from '@modules/posts/dtos/IPostDTO';
import Post from '@modules/posts/entities/Post';
import { instanceToInstance } from 'class-transformer';
import IResponseDTO from '@dtos/IResponseDTO';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';

@injectable()
export default class CreatePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('ProfilesRepository')
    private profilesRepository: IProfilesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(postData: IPostDTO): Promise<IResponseDTO<Post>> {
    const profile = await this.profilesRepository.findBy({
      id: postData.profile_id,
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    if (postData.image) {
      await this.storageProvider.saveFile(postData.image);
    }

    const post = await this.postsRepository.create({
      ...postData,
      profile_id: profile.id,
    });

    await this.cacheProvider.invalidatePrefix('posts');

    return {
      code: 201,
      message_code: 'CREATED',
      message: 'Post successfully created',
      data: instanceToInstance(post),
    };
  }
}

import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import ICommentsRepository from '@modules/posts/repositories/ICommentsRepository';
import ICommentDTO from '@modules/posts/dtos/ICommentDTO';
import Comment from '@modules/posts/entities/Comment';
import { instanceToInstance } from 'class-transformer';
import IResponseDTO from '@dtos/IResponseDTO';
import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';
import AppError from '@shared/errors/AppError';

@injectable()
export default class CreateCommentService {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('ProfilesRepository')
    private profilesRepository: IProfilesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(commentData: ICommentDTO): Promise<IResponseDTO<Comment>> {
    const profile = await this.profilesRepository.findBy({
      id: commentData.profile_id,
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    const comment = await this.commentsRepository.create({
      ...commentData,
      profile_id: profile.id,
    });

    await this.cacheProvider.invalidatePrefix('posts');
    await this.cacheProvider.invalidatePrefix('comments');

    return {
      code: 201,
      message_code: 'CREATED',
      message: 'Comment successfully created',
      data: instanceToInstance(comment),
    };
  }
}

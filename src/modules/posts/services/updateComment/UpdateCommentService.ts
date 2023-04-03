import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import ICommentsRepository from '@modules/posts/repositories/ICommentsRepository';
import ICommentDTO from '@modules/posts/dtos/ICommentDTO';
import mapAndUpdateAttribute from '@utils/mappers/mapAndUpdateAttribute';
import Comment from '@modules/posts/entities/Comment';
import { instanceToInstance } from 'class-transformer';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';

@injectable()
export default class UpdateCommentService {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(
    commentParam: IObjectDTO,
    commentData: ICommentDTO,
  ): Promise<IResponseDTO<Comment>> {
    const comment = await this.commentsRepository.findBy(commentParam, [
      'answers',
    ]);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    await this.cacheProvider.invalidatePrefix('posts');
    await this.cacheProvider.invalidatePrefix('comments');

    await this.commentsRepository.update(
      await mapAndUpdateAttribute(comment, commentData),
    );

    return {
      code: 200,
      message_code: 'OK',
      message: 'successfully updated comment',
      data: instanceToInstance(comment),
    };
  }
}

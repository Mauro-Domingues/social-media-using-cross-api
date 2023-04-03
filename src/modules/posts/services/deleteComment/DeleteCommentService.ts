import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ICommentsRepository from '@modules/posts/repositories/ICommentsRepository';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';

@injectable()
export default class DeleteCommentService {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(commentParam: IObjectDTO): Promise<IResponseDTO<null>> {
    const comment = await this.commentsRepository.findBy(commentParam);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    await this.cacheProvider.invalidatePrefix('posts');
    await this.cacheProvider.invalidatePrefix('comments');

    this.commentsRepository.delete(comment);

    return {
      code: 204,
      message_code: 'NO_CONTENT',
      message: 'successfully deleted comment',
      data: null,
    };
  }
}

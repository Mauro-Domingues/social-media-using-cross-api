import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICommentsRepository from '@modules/posts/repositories/ICommentsRepository';
import Comment from '@modules/posts/entities/Comment';
import { instanceToInstance } from 'class-transformer';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';

@injectable()
export default class ShowCommentService {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  async execute(commentParam: IObjectDTO): Promise<IResponseDTO<Comment>> {
    const comment = await this.commentsRepository.findBy(commentParam, [
      'answers',
    ]);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Comment found successfully',
      data: instanceToInstance(comment),
    };
  }
}

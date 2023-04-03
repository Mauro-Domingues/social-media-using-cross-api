import ICommentDTO from '@modules/posts/dtos/ICommentDTO';
import { DeleteResult, Repository } from 'typeorm';

import Comment from '@modules/posts/entities/Comment';
import ICommentsRepository from '@modules/posts/repositories/ICommentsRepository';
import { AppDataSource } from '@shared/typeorm/dataSource';
import IObjectDTO from '@dtos/IObjectDTO';

export default class CommentsRepository implements ICommentsRepository {
  private ormRepository: Repository<Comment>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Comment);
  }

  public async findBy(
    commentData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Comment | null> {
    const comment = await this.ormRepository.findOne({
      where: commentData,
      relations,
    });

    return comment;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ comments: Comment[]; amount: number }> {
    const [comments, amount] = await this.ormRepository.findAndCount({
      where: conditions,
      take: limit,
      skip: (page - 1) * limit,
      relations,
    });

    return { comments, amount };
  }

  public async create(commentData: ICommentDTO): Promise<Comment> {
    const comment = this.ormRepository.create(commentData);

    await this.ormRepository.save(comment);

    return comment;
  }

  public async update(commentData: Comment): Promise<Comment> {
    return this.ormRepository.save(commentData);
  }

  public async delete(commentData: Comment | IObjectDTO): Promise<DeleteResult> {
    if (commentData instanceof Comment) {
      return this.ormRepository.delete({ id: commentData.id });
    }
    return this.ormRepository.delete(commentData);
  }

  public async softDelete(commentData: Comment | IObjectDTO): Promise<DeleteResult> {
    if (commentData instanceof Comment) {
      return this.ormRepository.softDelete({ id: commentData.id });
    }
    return this.ormRepository.softDelete(commentData);
  }
}

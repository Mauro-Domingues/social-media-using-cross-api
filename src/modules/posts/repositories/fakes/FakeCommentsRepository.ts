/* eslint-disable @typescript-eslint/no-explicit-any */
import IObjectDTO from '@dtos/IObjectDTO';
import ICommentDTO from '@modules/posts/dtos/ICommentDTO';
import Comment from '@modules/posts/entities/Comment';
import ICommentsRepository from '@modules/posts/repositories/ICommentsRepository';
import { v4 as uuid } from 'uuid';

export default class FakeCommentsRepository implements ICommentsRepository {
  private comments: Comment[] = [];

  public async findBy(
    commentData: IObjectDTO | IObjectDTO[],
  ): Promise<Comment | null> {
    let findComment: Comment | undefined;
    if (commentData && Array.isArray(commentData)) {
      commentData.forEach((data: IObjectDTO) => {
        Object.keys(data).forEach((key: string) => {
          findComment = this.comments.find(
            (comment: any) => comment[key] === data[key],
          );
        });
      });
    } else if (commentData) {
      Object.keys(commentData).forEach((key: string) => {
        findComment = this.comments.find(
          (comment: any) => comment[key] === commentData[key],
        );
      });
    }

    if (!findComment) {
      return null;
    }
    return findComment;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
  ): Promise<{ comments: Comment[]; amount: number }> {
    const filterComments: Comment[] = [];
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach((condition: IObjectDTO) => {
        Object.keys(condition).forEach((key: string) => {
          const applyFilter: Comment[] = this.comments.filter(
            (comment: any) => comment[key] === condition[key],
          );

          applyFilter.forEach((comment: Comment) => filterComments.push(comment));
        });
      });
    } else if (conditions) {
      let applyFilter: Comment[] = this.comments;
      Object.keys(conditions).forEach((key: string) => {
        applyFilter = applyFilter.filter(
          (comment: any) => comment[key] === conditions[key],
        );
      });

      applyFilter.forEach((comment: Comment) => filterComments.push(comment));
    } else {
      this.comments.forEach((comment: Comment) => filterComments.push(comment));
    }

    const filtredComments = filterComments.slice((page - 1) * limit, page * limit);

    return { comments: filtredComments, amount: filterComments.length };
  }

  public async create(commentData: ICommentDTO): Promise<Comment> {
    const comment: Comment = new Comment();

    Object.assign(comment, { id: uuid() }, commentData);
    this.comments.push(comment);

    return comment;
  }

  public async update(commentData: Comment): Promise<Comment> {
    const findComment: number = this.comments.findIndex(
      comment => comment.id === commentData.id,
    );

    this.comments[findComment] = commentData;

    return commentData;
  }

  public async delete(commentData: Comment | IObjectDTO): Promise<void> {
    if (commentData instanceof Comment) {
      const findComment: number = this.comments.findIndex(
        comment => comment.id === commentData.id,
      );

      this.comments.splice(findComment, 1);
    } else {
      Object.keys(commentData).forEach((key: string) => {
        const findComment: Comment[] = this.comments.filter(
          (comment: any) => comment[key] === commentData[key],
        );

        findComment.forEach(eachComment => {
          const commentIndex: number = this.comments.findIndex(
            comment => comment.id === eachComment.id,
          );

          this.comments.splice(commentIndex, 1);
        });
      });
    }
  }

  public async softDelete(commentData: Comment | IObjectDTO): Promise<void> {
    if (commentData instanceof Comment) {
      const findComment: number = this.comments.findIndex(
        (comment: any) => comment.id === commentData.id,
      );

      this.comments[findComment].deleted_at = new Date();
    } else {
      Object.keys(commentData).forEach((key: string) => {
        const findComment: Comment[] = this.comments.filter(
          (comment: any) => comment[key] === commentData[key],
        );

        findComment.forEach(eachComment => {
          const commentIndex: number = this.comments.findIndex(
            comment => comment.id === eachComment.id,
          );

          this.comments[commentIndex].deleted_at = new Date();
        });
      });
    }
  }
}

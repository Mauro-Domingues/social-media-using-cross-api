import Answer from '@modules/posts/entities/Answer';
import IAnswerDTO from '@modules/posts/dtos/IAnswerDTO';
import { DeleteResult } from 'typeorm';
import IObjectDTO from '@dtos/IObjectDTO';

export default interface IAnswersRepository {
  findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ answers: Answer[]; amount: number }>;
  findBy(
    answerData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Answer | null>;
  create(answerData: IAnswerDTO): Promise<Answer>;
  update(answerData: Answer): Promise<Answer>;
  delete(answerData: Answer | IObjectDTO): Promise<DeleteResult | void>;
  softDelete(answerData: Answer | IObjectDTO): Promise<DeleteResult | void>;
}

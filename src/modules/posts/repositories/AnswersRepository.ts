import IAnswerDTO from '@modules/posts/dtos/IAnswerDTO';
import { DeleteResult, Repository } from 'typeorm';

import Answer from '@modules/posts/entities/Answer';
import IAnswersRepository from '@modules/posts/repositories/IAnswersRepository';
import { AppDataSource } from '@shared/typeorm/dataSource';
import IObjectDTO from '@dtos/IObjectDTO';

export default class AnswersRepository implements IAnswersRepository {
  private ormRepository: Repository<Answer>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Answer);
  }

  public async findBy(
    answerData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Answer | null> {
    const answer = await this.ormRepository.findOne({
      where: answerData,
      relations,
    });

    return answer;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ answers: Answer[]; amount: number }> {
    const [answers, amount] = await this.ormRepository.findAndCount({
      where: conditions,
      take: limit,
      skip: (page - 1) * limit,
      relations,
    });

    return { answers, amount };
  }

  public async create(answerData: IAnswerDTO): Promise<Answer> {
    const answer = this.ormRepository.create(answerData);

    await this.ormRepository.save(answer);

    return answer;
  }

  public async update(answerData: Answer): Promise<Answer> {
    return this.ormRepository.save(answerData);
  }

  public async delete(answerData: Answer | IObjectDTO): Promise<DeleteResult> {
    if (answerData instanceof Answer) {
      return this.ormRepository.delete({ id: answerData.id });
    }
    return this.ormRepository.delete(answerData);
  }

  public async softDelete(answerData: Answer | IObjectDTO): Promise<DeleteResult> {
    if (answerData instanceof Answer) {
      return this.ormRepository.softDelete({ id: answerData.id });
    }
    return this.ormRepository.softDelete(answerData);
  }
}

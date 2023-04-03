/* eslint-disable @typescript-eslint/no-explicit-any */
import IObjectDTO from '@dtos/IObjectDTO';
import IAnswerDTO from '@modules/posts/dtos/IAnswerDTO';
import Answer from '@modules/posts/entities/Answer';
import IAnswersRepository from '@modules/posts/repositories/IAnswersRepository';
import { v4 as uuid } from 'uuid';

export default class FakeAnswersRepository implements IAnswersRepository {
  private answers: Answer[] = [];

  public async findBy(
    answerData: IObjectDTO | IObjectDTO[],
  ): Promise<Answer | null> {
    let findAnswer: Answer | undefined;
    if (answerData && Array.isArray(answerData)) {
      answerData.forEach((data: IObjectDTO) => {
        Object.keys(data).forEach((key: string) => {
          findAnswer = this.answers.find(
            (answer: any) => answer[key] === data[key],
          );
        });
      });
    } else if (answerData) {
      Object.keys(answerData).forEach((key: string) => {
        findAnswer = this.answers.find(
          (answer: any) => answer[key] === answerData[key],
        );
      });
    }

    if (!findAnswer) {
      return null;
    }
    return findAnswer;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
  ): Promise<{ answers: Answer[]; amount: number }> {
    const filterAnswers: Answer[] = [];
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach((condition: IObjectDTO) => {
        Object.keys(condition).forEach((key: string) => {
          const applyFilter: Answer[] = this.answers.filter(
            (answer: any) => answer[key] === condition[key],
          );

          applyFilter.forEach((answer: Answer) => filterAnswers.push(answer));
        });
      });
    } else if (conditions) {
      let applyFilter: Answer[] = this.answers;
      Object.keys(conditions).forEach((key: string) => {
        applyFilter = applyFilter.filter(
          (answer: any) => answer[key] === conditions[key],
        );
      });

      applyFilter.forEach((answer: Answer) => filterAnswers.push(answer));
    } else {
      this.answers.forEach((answer: Answer) => filterAnswers.push(answer));
    }

    const filtredAnswers = filterAnswers.slice((page - 1) * limit, page * limit);

    return { answers: filtredAnswers, amount: filterAnswers.length };
  }

  public async create(answerData: IAnswerDTO): Promise<Answer> {
    const answer: Answer = new Answer();

    Object.assign(answer, { id: uuid() }, answerData);
    this.answers.push(answer);

    return answer;
  }

  public async update(answerData: Answer): Promise<Answer> {
    const findAnswer: number = this.answers.findIndex(
      answer => answer.id === answerData.id,
    );

    this.answers[findAnswer] = answerData;

    return answerData;
  }

  public async delete(answerData: Answer | IObjectDTO): Promise<void> {
    if (answerData instanceof Answer) {
      const findAnswer: number = this.answers.findIndex(
        answer => answer.id === answerData.id,
      );

      this.answers.splice(findAnswer, 1);
    } else {
      Object.keys(answerData).forEach((key: string) => {
        const findAnswer: Answer[] = this.answers.filter(
          (answer: any) => answer[key] === answerData[key],
        );

        findAnswer.forEach(eachAnswer => {
          const answerIndex: number = this.answers.findIndex(
            answer => answer.id === eachAnswer.id,
          );

          this.answers.splice(answerIndex, 1);
        });
      });
    }
  }

  public async softDelete(answerData: Answer | IObjectDTO): Promise<void> {
    if (answerData instanceof Answer) {
      const findAnswer: number = this.answers.findIndex(
        (answer: any) => answer.id === answerData.id,
      );

      this.answers[findAnswer].deleted_at = new Date();
    } else {
      Object.keys(answerData).forEach((key: string) => {
        const findAnswer: Answer[] = this.answers.filter(
          (answer: any) => answer[key] === answerData[key],
        );

        findAnswer.forEach(eachAnswer => {
          const answerIndex: number = this.answers.findIndex(
            answer => answer.id === eachAnswer.id,
          );

          this.answers[answerIndex].deleted_at = new Date();
        });
      });
    }
  }
}

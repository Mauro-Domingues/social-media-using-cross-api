import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IAnswersRepository from '@modules/posts/repositories/IAnswersRepository';
import IAnswerDTO from '@modules/posts/dtos/IAnswerDTO';
import Answer from '@modules/posts/entities/Answer';
import { instanceToInstance } from 'class-transformer';
import IResponseDTO from '@dtos/IResponseDTO';
import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';
import AppError from '@shared/errors/AppError';

@injectable()
export default class CreateAnswerService {
  constructor(
    @inject('AnswersRepository')
    private answersRepository: IAnswersRepository,

    @inject('ProfilesRepository')
    private profilesRepository: IProfilesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(answerData: IAnswerDTO): Promise<IResponseDTO<Answer>> {
    const profile = await this.profilesRepository.findBy({
      id: answerData.profile_id,
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    const answer = await this.answersRepository.create({
      ...answerData,
      profile_id: profile.id,
    });

    await this.cacheProvider.invalidatePrefix('posts');
    await this.cacheProvider.invalidatePrefix('answers');
    await this.cacheProvider.invalidatePrefix('comments');

    return {
      code: 201,
      message_code: 'CREATED',
      message: 'Answer successfully created',
      data: instanceToInstance(answer),
    };
  }
}

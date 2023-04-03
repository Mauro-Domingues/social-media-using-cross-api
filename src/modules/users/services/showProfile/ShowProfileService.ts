import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';
import Profile from '@modules/users/entities/Profile';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';
import { instanceToInstance } from 'class-transformer';

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('ProfilesRepository')
    private profilesRepository: IProfilesRepository,
  ) {}

  async execute(profileParam: IObjectDTO): Promise<IResponseDTO<Profile>> {
    const profile = await this.profilesRepository.findBy(profileParam, []);

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Profile found successfully',
      data: instanceToInstance(profile),
    };
  }
}

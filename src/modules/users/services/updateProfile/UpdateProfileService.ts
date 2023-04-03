import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';
import IProfileDTO from '@modules/users/dtos/IProfileDTO';
import mapAndUpdateAttribute from '@utils/mappers/mapAndUpdateAttribute';
import Profile from '@modules/users/entities/Profile';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';
import { instanceToInstance } from 'class-transformer';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('ProfilesRepository')
    private profilesRepository: IProfilesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(
    profileParam: IObjectDTO,
    profileData: IProfileDTO,
  ): Promise<IResponseDTO<Profile>> {
    const profile = await this.profilesRepository.findBy(profileParam);

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    if (profileData.avatar) {
      await this.storageProvider.deleteFile(profile.avatar);
      const filename = await this.storageProvider.saveFile(profileData.avatar);
      profileData.avatar = filename;
    }

    await this.cacheProvider.invalidatePrefix('profiles');

    await this.profilesRepository.update(
      await mapAndUpdateAttribute(profile, profileData),
    );

    return {
      code: 200,
      message_code: 'OK',
      message: 'successfully updated profile',
      data: instanceToInstance(profile),
    };
  }
}

import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';
import IProfileDTO from '@modules/users/dtos/IProfileDTO';
import Profile from '@modules/users/entities/Profile';
import IResponseDTO from '@dtos/IResponseDTO';
import { instanceToInstance } from 'class-transformer';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

@injectable()
export default class CreateProfileService {
  constructor(
    @inject('ProfilesRepository')
    private profilesRepository: IProfilesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(profileData: IProfileDTO): Promise<IResponseDTO<Profile>> {
    if (profileData.avatar) {
      await this.storageProvider.saveFile(profileData.avatar);
    }

    const profile = await this.profilesRepository.create(profileData);

    await this.cacheProvider.invalidatePrefix('profiles');

    return {
      code: 201,
      message_code: 'CREATED',
      message: 'Profile successfully created',
      data: instanceToInstance(profile),
    };
  }
}

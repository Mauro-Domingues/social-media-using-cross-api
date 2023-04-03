import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

@injectable()
export default class DeleteProfileService {
  constructor(
    @inject('ProfilesRepository')
    private profilesRepository: IProfilesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(profileParam: IObjectDTO): Promise<IResponseDTO<null>> {
    const profile = await this.profilesRepository.findBy(profileParam);

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    if (profile.avatar) {
      await this.storageProvider.deleteFile(profile.avatar);
    }

    await this.cacheProvider.invalidatePrefix('profiles');

    this.profilesRepository.delete(profile);

    return {
      code: 204,
      message_code: 'NO_CONTENT',
      message: 'successfully deleted profile',
      data: null,
    };
  }
}

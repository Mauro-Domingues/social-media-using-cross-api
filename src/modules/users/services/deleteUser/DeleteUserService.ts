import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

@injectable()
export default class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(userParam: IObjectDTO): Promise<IResponseDTO<null>> {
    const user = await this.usersRepository.findBy(userParam, ['profile']);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.profile.avatar) {
      await this.storageProvider.deleteFile(user.profile.avatar);
    }

    await this.cacheProvider.invalidatePrefix('users');
    await this.cacheProvider.invalidatePrefix(`me:${user.id}`);

    this.usersRepository.delete(user);

    return {
      code: 204,
      message_code: 'NO_CONTENT',
      message: 'successfully deleted user',
      data: null,
    };
  }
}

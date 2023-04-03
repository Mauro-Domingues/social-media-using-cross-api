import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/entities/User';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';
import { instanceToInstance } from 'class-transformer';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
export default class ShowSelfUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(userParam: IObjectDTO): Promise<IResponseDTO<User>> {
    const cacheKey = `me:${userParam.id}`;
    let cache = await this.cacheProvider.recovery<{ data: User }>(cacheKey);

    if (!cache) {
      const user = await this.usersRepository.findBy(userParam, [
        'addresses',
        'profile',
        'profile.posts',
        'role',
        'permissions',
      ]);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      cache = {
        data: instanceToInstance(user),
      };
      await this.cacheProvider.save(cacheKey, cache);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'User found successfully',
      data: cache.data,
    };
  }
}

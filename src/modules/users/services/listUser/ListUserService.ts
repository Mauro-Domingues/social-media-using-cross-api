import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '@modules/users/entities/User';
import ICacheDTO from '@dtos/ICacheDTO';
import IListDTO from '@dtos/IListDTO';
import { instanceToInstance } from 'class-transformer';

@injectable()
export default class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<IListDTO<Omit<User, 'password'>>> {
    const cacheKey = `users:${page}:${limit}`;

    let cache = await this.cacheProvider.recovery<ICacheDTO<User>>(cacheKey);

    if (!cache) {
      const { users, amount } = await this.usersRepository.findAll(page, limit);
      cache = {
        data: instanceToInstance(users),
        total: instanceToInstance(amount),
      };
      await this.cacheProvider.save(cacheKey, cache);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Users found successfully',
      pagination: {
        total: cache.total,
        page,
        perPage: limit,
        lastPage: cache.total % limit,
      },
      data: cache.data,
    };
  }
}

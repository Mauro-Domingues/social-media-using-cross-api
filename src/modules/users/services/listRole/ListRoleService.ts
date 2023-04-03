import { injectable, inject } from 'tsyringe';

import IRolesRepository from '@modules/users/repositories/IRolesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Role from '@modules/users/entities/Role';
import { instanceToInstance } from 'class-transformer';
import ICacheDTO from '@dtos/ICacheDTO';
import IListDTO from '@dtos/IListDTO';

@injectable()
export default class ListRoleService {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(page: number, limit: number): Promise<IListDTO<Role>> {
    const cacheKey = `roles:${page}:${limit}`;

    let cache = await this.cacheProvider.recovery<ICacheDTO<Role>>(cacheKey);

    if (!cache) {
      const { roles, amount } = await this.rolesRepository.findAll(page, limit);
      cache = { data: instanceToInstance(roles), total: amount };
      await this.cacheProvider.save(cacheKey, cache);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Roles found successfully',
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

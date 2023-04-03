import { injectable, inject } from 'tsyringe';

import IPermissionsRepository from '@modules/users/repositories/IPermissionsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Permission from '@modules/users/entities/Permission';
import { instanceToInstance } from 'class-transformer';
import ICacheDTO from '@dtos/ICacheDTO';
import IListDTO from '@dtos/IListDTO';

@injectable()
export default class ListPermissionService {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(page: number, limit: number): Promise<IListDTO<Permission>> {
    const cacheKey = `permissions:${page}:${limit}`;

    let cache = await this.cacheProvider.recovery<ICacheDTO<Permission>>(cacheKey);

    if (!cache) {
      const { permissions, amount } = await this.permissionsRepository.findAll(page, limit);
      cache = { data: instanceToInstance(permissions), total: amount };
      await this.cacheProvider.save(cacheKey, cache);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Permissions found successfully',
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

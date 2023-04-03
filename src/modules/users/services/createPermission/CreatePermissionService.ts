import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IPermissionsRepository from '@modules/users/repositories/IPermissionsRepository';
import IPermissionDTO from '@modules/users/dtos/IPermissionDTO';
import Permission from '@modules/users/entities/Permission';
import { instanceToInstance } from 'class-transformer';
import IResponseDTO from '@dtos/IResponseDTO';
import { Slugify } from '@utils/slugify';
import IRolesRepository from '@modules/users/repositories/IRolesRepository';

@injectable()
export default class CreatePermissionService {
  private slugify: Slugify<IPermissionsRepository>;

  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository,

    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {
    this.slugify = new Slugify(this.permissionsRepository);
  }

  async execute(
    permissionData: IPermissionDTO,
  ): Promise<IResponseDTO<Permission>> {
    if (permissionData.name) {
      permissionData.slug = await this.slugify.execute(permissionData.name);
    }

    if (permissionData.roles_id_array) {
      permissionData.roles = await this.rolesRepository.findMany(
        permissionData.roles_id_array,
        'id',
      );
    }

    const permission = await this.permissionsRepository.create(permissionData);

    await this.cacheProvider.invalidatePrefix('permissions');
    await this.cacheProvider.invalidatePrefix('roles');

    return {
      code: 201,
      message_code: 'CREATED',
      message: 'Permission successfully created',
      data: instanceToInstance(permission),
    };
  }
}

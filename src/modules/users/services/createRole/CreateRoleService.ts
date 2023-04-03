import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IRolesRepository from '@modules/users/repositories/IRolesRepository';
import IRoleDTO from '@modules/users/dtos/IRoleDTO';
import Role from '@modules/users/entities/Role';
import { instanceToInstance } from 'class-transformer';
import IResponseDTO from '@dtos/IResponseDTO';
import IPermissionsRepository from '@modules/users/repositories/IPermissionsRepository';
import { Slugify } from '@utils/slugify';

@injectable()
export default class CreateRoleService {
  private slugify: Slugify<IRolesRepository>;

  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,

    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {
    this.slugify = new Slugify(this.rolesRepository);
  }

  async execute(roleData: IRoleDTO): Promise<IResponseDTO<Role>> {
    if (roleData.name) {
      roleData.slug = await this.slugify.execute(roleData.name);
    }

    if (roleData.permissions_id_array) {
      roleData.permissions = await this.permissionsRepository.findMany(
        roleData.permissions_id_array,
        'id',
      );
    }

    const role = await this.rolesRepository.create(roleData);

    await this.cacheProvider.invalidatePrefix('permissions');
    await this.cacheProvider.invalidatePrefix('roles');

    return {
      code: 201,
      message_code: 'CREATED',
      message: 'Role successfully created',
      data: instanceToInstance(role),
    };
  }
}

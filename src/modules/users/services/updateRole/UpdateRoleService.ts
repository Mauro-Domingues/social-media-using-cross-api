import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IRolesRepository from '@modules/users/repositories/IRolesRepository';
import IRoleDTO from '@modules/users/dtos/IRoleDTO';
import mapAndUpdateAttribute from '@utils/mappers/mapAndUpdateAttribute';
import Role from '@modules/users/entities/Role';
import { instanceToInstance } from 'class-transformer';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';
import IPermissionsRepository from '@modules/users/repositories/IPermissionsRepository';

@injectable()
export default class UpdateRoleService {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,

    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(
    roleParam: IObjectDTO,
    roleData: IRoleDTO,
  ): Promise<IResponseDTO<Role>> {
    const role = await this.rolesRepository.findBy(roleParam);

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    if (roleData.permissions_id_array) {
      roleData.permissions = await this.permissionsRepository.findMany(
        roleData.permissions_id_array,
        'id',
      );
    }

    await this.cacheProvider.invalidatePrefix('permissions');
    await this.cacheProvider.invalidatePrefix('roles');

    await this.rolesRepository.update(
      await mapAndUpdateAttribute(role, roleData),
    );

    return {
      code: 200,
      message_code: 'OK',
      message: 'successfully updated role',
      data: instanceToInstance(role),
    };
  }
}

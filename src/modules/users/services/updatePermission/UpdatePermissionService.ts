import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IPermissionsRepository from '@modules/users/repositories/IPermissionsRepository';
import IPermissionDTO from '@modules/users/dtos/IPermissionDTO';
import mapAndUpdateAttribute from '@utils/mappers/mapAndUpdateAttribute';
import Permission from '@modules/users/entities/Permission';
import { instanceToInstance } from 'class-transformer';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';
import IRolesRepository from '@modules/users/repositories/IRolesRepository';

@injectable()
export default class UpdatePermissionService {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository,

    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(
    permissionParam: IObjectDTO,
    permissionData: IPermissionDTO,
  ): Promise<IResponseDTO<Permission>> {
    const permission = await this.permissionsRepository.findBy(permissionParam);

    if (!permission) {
      throw new AppError('Permission not found', 404);
    }

    if (permissionData.roles_id_array) {
      permissionData.roles = await this.rolesRepository.findMany(
        permissionData.roles_id_array,
        'id',
      );
    }

    await this.cacheProvider.invalidatePrefix('permissions');
    await this.cacheProvider.invalidatePrefix('roles');

    await this.permissionsRepository.update(
      await mapAndUpdateAttribute(permission, permissionData),
    );

    return {
      code: 200,
      message_code: 'OK',
      message: 'successfully updated permission',
      data: instanceToInstance(permission),
    };
  }
}

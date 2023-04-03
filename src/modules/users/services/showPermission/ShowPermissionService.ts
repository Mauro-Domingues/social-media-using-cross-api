import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IPermissionsRepository from '@modules/users/repositories/IPermissionsRepository';
import Permission from '@modules/users/entities/Permission';
import { instanceToInstance } from 'class-transformer';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';

@injectable()
export default class ShowPermissionService {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository,
  ) {}

  async execute(
    permissionParam: IObjectDTO,
  ): Promise<IResponseDTO<Permission>> {
    const permission = await this.permissionsRepository.findBy(
      permissionParam,
      [],
    );

    if (!permission) {
      throw new AppError('Permission not found', 404);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Permission found successfully',
      data: instanceToInstance(permission),
    };
  }
}

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPermissionsRepository from '@modules/users/repositories/IPermissionsRepository';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';

@injectable()
export default class DeletePermissionService {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(permissionParam: IObjectDTO): Promise<IResponseDTO<null>> {
    const permission = await this.permissionsRepository.findBy(permissionParam);

    if (!permission) {
      throw new AppError('Permission not found', 404);
    }

    await this.cacheProvider.invalidatePrefix('permissions');
    await this.cacheProvider.invalidatePrefix('roles');

    this.permissionsRepository.delete(permission);

    return {
      code: 204,
      message_code: 'NO_CONTENT',
      message: 'successfully deleted permission',
      data: null,
    };
  }
}

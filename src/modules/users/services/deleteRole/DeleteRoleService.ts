import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IRolesRepository from '@modules/users/repositories/IRolesRepository';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';

@injectable()
export default class DeleteRoleService {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(roleParam: IObjectDTO): Promise<IResponseDTO<null>> {
    const role = await this.rolesRepository.findBy(roleParam);

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    await this.cacheProvider.invalidatePrefix('permissions');
    await this.cacheProvider.invalidatePrefix('roles');

    this.rolesRepository.delete(role);

    return {
      code: 204,
      message_code: 'NO_CONTENT',
      message: 'successfully deleted role',
      data: null,
    };
  }
}

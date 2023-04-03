import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IRolesRepository from '@modules/users/repositories/IRolesRepository';
import Role from '@modules/users/entities/Role';
import { instanceToInstance } from 'class-transformer';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';

@injectable()
export default class ShowRoleService {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
  ) {}

  async execute(roleParam: IObjectDTO): Promise<IResponseDTO<Role>> {
    const role = await this.rolesRepository.findBy(roleParam, ['permissions']);

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Role found successfully',
      data: instanceToInstance(role),
    };
  }
}

import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserDTO from '@modules/users/dtos/IUserDTO';
import User from '@modules/users/entities/User';
import IResponseDTO from '@dtos/IResponseDTO';
import AppError from '@shared/errors/AppError';
import { instanceToInstance } from 'class-transformer';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';
import IRolesRepository from '@modules/users/repositories/IRolesRepository';
import IPermissionsRepository from '@modules/users/repositories/IPermissionsRepository';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ProfilesRepository')
    private profilesRepository: IProfilesRepository,

    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,

    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute(userData: IUserDTO): Promise<IResponseDTO<User>> {
    const checkUser = await this.usersRepository.findBy({
      email: userData.email,
    });

    if (checkUser) {
      throw new AppError('Email address already in use');
    }

    if (userData.role_id) {
      const role = await this.rolesRepository.findBy({ id: userData.role_id });

      if (!role) {
        throw new AppError('Role not found', 404);
      }

      userData.role = role;
    }

    if (userData.permissions_id_array) {
      userData.permissions = await this.permissionsRepository.findMany(
        userData.permissions_id_array,
        'id',
      );
    }

    const hashedPassword = await this.hashProvider.generateHash(
      userData.password,
    );

    const user = await this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const profile = await this.profilesRepository.create({
      ...userData,
      user_id: user.id,
    });

    await this.usersRepository.update({
      ...user,
      profile_id: profile.id,
    });

    await this.cacheProvider.invalidatePrefix('users');
    await this.cacheProvider.invalidatePrefix(`me:${user.id}`);

    return {
      code: 201,
      message_code: 'CREATED',
      message: 'User successfully created',
      data: instanceToInstance(user),
    };
  }
}

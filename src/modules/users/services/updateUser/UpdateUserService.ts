import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserDTO from '@modules/users/dtos/IUserDTO';
import mapAndUpdateAttribute from '@utils/mappers/mapAndUpdateAttribute';
import User from '@modules/users/entities/User';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';
import { instanceToInstance } from 'class-transformer';
import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';
import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IRolesRepository from '@modules/users/repositories/IRolesRepository';
import IPermissionsRepository from '@modules/users/repositories/IPermissionsRepository';

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ProfilesRepository')
    private profilesRepository: IProfilesRepository,

    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,

    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository,

    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(
    userParam: IObjectDTO,
    userData: Omit<IUserDTO, 'email' | 'password'>,
  ): Promise<IResponseDTO<User>> {
    const user = await this.usersRepository.findBy(userParam);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const profile = await this.profilesRepository.findBy({
      user_id: user.id,
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    const address = await this.addressesRepository.findBy({ user_id: user.id });

    if (!address && userData.address) {
      await this.addressesRepository.create({
        ...userData.address,
        type: 'address',
      });
    } else if (address && userData.address) {
      await this.addressesRepository.update(
        await mapAndUpdateAttribute(address, userData.address),
      );
    }

    if (userData.avatar) {
      if (user.profile.avatar)
        await this.storageProvider.deleteFile(user.profile.avatar);
      await this.storageProvider.saveFile(userData.avatar);
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

    await this.profilesRepository.update(
      await mapAndUpdateAttribute(profile, userData),
    );

    await this.usersRepository.update(
      await mapAndUpdateAttribute(user, userData),
    );

    await this.cacheProvider.invalidatePrefix(`me:${user.id}`);
    await this.cacheProvider.invalidatePrefix('users');
    await this.cacheProvider.invalidatePrefix('addresses');
    await this.cacheProvider.invalidatePrefix('profiles');

    return {
      code: 200,
      message_code: 'OK',
      message: 'successfully updated user',
      data: instanceToInstance(user),
    };
  }
}

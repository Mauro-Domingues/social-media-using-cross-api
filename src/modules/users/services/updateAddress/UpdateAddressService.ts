import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';
import IAddressDTO from '@modules/users/dtos/IAddressDTO';
import mapAndUpdateAttribute from '@utils/mappers/mapAndUpdateAttribute';
import Address from '@modules/users/entities/Address';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';
import { instanceToInstance } from 'class-transformer';

@injectable()
export default class UpdateAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(
    addressParam: IObjectDTO,
    addressData: IAddressDTO,
  ): Promise<IResponseDTO<Address>> {
    const address = await this.addressesRepository.findBy(addressParam);

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    await this.cacheProvider.invalidatePrefix('addresses');

    await this.addressesRepository.update(
      await mapAndUpdateAttribute(address, addressData),
    );

    return {
      code: 200,
      message_code: 'OK',
      message: 'successfully updated address',
      data: instanceToInstance(address),
    };
  }
}

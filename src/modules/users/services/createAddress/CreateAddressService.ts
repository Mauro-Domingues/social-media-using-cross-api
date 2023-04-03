import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';
import IAddressDTO from '@modules/users/dtos/IAddressDTO';
import Address from '@modules/users/entities/Address';
import IResponseDTO from '@dtos/IResponseDTO';
import { instanceToInstance } from 'class-transformer';

@injectable()
export default class CreateAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(addressData: IAddressDTO): Promise<IResponseDTO<Address>> {
    const address = await this.addressesRepository.create(addressData);

    await this.cacheProvider.invalidatePrefix('addresses');

    return {
      code: 201,
      message_code: 'CREATED',
      message: 'Address successfully created',
      data: instanceToInstance(address),
    };
  }
}

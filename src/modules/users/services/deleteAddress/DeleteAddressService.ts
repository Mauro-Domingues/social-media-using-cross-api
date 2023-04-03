import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';

@injectable()
export default class DeleteAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(addressParam: IObjectDTO): Promise<IResponseDTO<null>> {
    const address = await this.addressesRepository.findBy(addressParam);

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    await this.cacheProvider.invalidatePrefix('addresses');

    this.addressesRepository.delete(address);

    return {
      code: 204,
      message_code: 'NO_CONTENT',
      message: 'successfully deleted address',
      data: null,
    };
  }
}

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';
import Address from '@modules/users/entities/Address';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';
import { instanceToInstance } from 'class-transformer';

@injectable()
export default class ShowAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  async execute(addressParam: IObjectDTO): Promise<IResponseDTO<Address>> {
    const address = await this.addressesRepository.findBy(addressParam, []);

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Address found successfully',
      data: instanceToInstance(address),
    };
  }
}

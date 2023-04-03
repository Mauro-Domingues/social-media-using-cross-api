import { injectable, inject } from 'tsyringe';

import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Address from '@modules/users/entities/Address';
import ICacheDTO from '@dtos/ICacheDTO';
import IListDTO from '@dtos/IListDTO';
import { instanceToInstance } from 'class-transformer';

@injectable()
export default class ListAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(page: number, limit: number): Promise<IListDTO<Address>> {
    const cacheKey = `addresses:${page}:${limit}`;

    let cache = await this.cacheProvider.recovery<ICacheDTO<Address>>(cacheKey);

    if (!cache) {
      const { addresses, amount } = await this.addressesRepository.findAll(
        page,
        limit,
      );
      cache = {
        data: instanceToInstance(addresses),
        total: amount,
      };
      await this.cacheProvider.save(cacheKey, cache);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Addresses found successfully',
      pagination: {
        total: cache.total,
        page,
        perPage: limit,
        lastPage: cache.total % limit,
      },
      data: cache.data,
    };
  }
}

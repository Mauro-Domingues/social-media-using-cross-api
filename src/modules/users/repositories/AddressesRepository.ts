import IAddressDTO from '@modules/users/dtos/IAddressDTO';
import { DeleteResult, Repository } from 'typeorm';

import Address from '@modules/users/entities/Address';
import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';
import { AppDataSource } from '@shared/typeorm/dataSource';
import IObjectDTO from '@dtos/IObjectDTO';

export default class AddressesRepository implements IAddressesRepository {
  private ormRepository: Repository<Address>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Address);
  }

  public async findBy(
    addressData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Address | null> {
    const address = await this.ormRepository.findOne({
      where: addressData,
      relations,
    });

    return address;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ addresses: Address[]; amount: number }> {
    const [addresses, amount] = await this.ormRepository.findAndCount({
      where: conditions,
      take: limit,
      skip: (page - 1) * limit,
      relations,
    });

    return { addresses, amount };
  }

  public async create(addressData: IAddressDTO): Promise<Address> {
    const address = this.ormRepository.create(addressData);

    await this.ormRepository.save(address);

    return address;
  }

  public async update(addressData: Address): Promise<Address> {
    return this.ormRepository.save(addressData);
  }

  public async delete(
    addressData: Address | IObjectDTO,
  ): Promise<DeleteResult> {
    if (addressData instanceof Address) {
      return this.ormRepository.delete({ id: addressData.id });
    }
    return this.ormRepository.delete(addressData);
  }

  public async softDelete(
    addressData: Address | IObjectDTO,
  ): Promise<DeleteResult> {
    if (addressData instanceof Address) {
      return this.ormRepository.softDelete({ id: addressData.id });
    }
    return this.ormRepository.softDelete(addressData);
  }
}

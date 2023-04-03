import Address from '@modules/users/entities/Address';
import IAddressDTO from '@modules/users/dtos/IAddressDTO';
import { DeleteResult } from 'typeorm';
import IObjectDTO from '@dtos/IObjectDTO';

export default interface IAddressesRepository {
  findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ addresses: Address[]; amount: number }>;
  findBy(
    addressData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Address | null>;
  create(addressData: IAddressDTO): Promise<Address>;
  update(addressData: Address): Promise<Address>;
  delete(addressData: Address | IObjectDTO): Promise<DeleteResult | void>;
  softDelete(addressData: Address | IObjectDTO): Promise<DeleteResult | void>;
}

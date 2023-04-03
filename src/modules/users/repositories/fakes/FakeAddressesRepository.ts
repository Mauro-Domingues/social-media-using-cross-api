/* eslint-disable @typescript-eslint/no-explicit-any */
import IObjectDTO from '@dtos/IObjectDTO';
import IAddressDTO from '@modules/users/dtos/IAddressDTO';
import Address from '@modules/users/entities/Address';
import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';
import { v4 as uuid } from 'uuid';

export default class FakeAddressesRepository implements IAddressesRepository {
  private addresses: Address[] = [];

  public async findBy(
    addressData: IObjectDTO | IObjectDTO[],
  ): Promise<Address | null> {
    let findAddress: Address | undefined;
    if (addressData && Array.isArray(addressData)) {
      addressData.forEach((data: IObjectDTO) => {
        Object.keys(data).forEach((key: string) => {
          findAddress = this.addresses.find(
            (address: any) => address[key] === data[key],
          );
        });
      });
    } else if (addressData) {
      Object.keys(addressData).forEach((key: string) => {
        findAddress = this.addresses.find(
          (address: any) => address[key] === addressData[key],
        );
      });
    }

    if (!findAddress) {
      return null;
    }
    return findAddress;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
  ): Promise<{ addresses: Address[]; amount: number }> {
    const filterAddresses: Address[] = [];
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach((condition: IObjectDTO) => {
        Object.keys(condition).forEach((key: string) => {
          const applyFilter: Address[] = this.addresses.filter(
            (address: any) => address[key] === condition[key],
          );

          applyFilter.forEach((address: Address) => filterAddresses.push(address));
        });
      });
    } else if (conditions) {
      let applyFilter: Address[] = this.addresses;
      Object.keys(conditions).forEach((key: string) => {
        applyFilter = applyFilter.filter(
          (address: any) => address[key] === conditions[key],
        );
      });

      applyFilter.forEach((address: Address) => filterAddresses.push(address));
    } else {
      this.addresses.forEach((address: Address) => filterAddresses.push(address));
    }

    const filtredAddresses = filterAddresses.slice((page - 1) * limit, page * limit);

    return { addresses: filtredAddresses, amount: filterAddresses.length };
  }

  public async create(addressData: IAddressDTO): Promise<Address> {
    const address: Address = new Address();

    Object.assign(address, { id: uuid() }, addressData);
    this.addresses.push(address);

    return address;
  }

  public async update(addressData: Address): Promise<Address> {
    const findAddress: number = this.addresses.findIndex(
      address => address.id === addressData.id,
    );

    this.addresses[findAddress] = addressData;

    return addressData;
  }

  public async delete(addressData: Address | IObjectDTO): Promise<void> {
    if (addressData instanceof Address) {
      const findAddress: number = this.addresses.findIndex(
        address => address.id === addressData.id,
      );

      this.addresses.splice(findAddress, 1);
    } else {
      Object.keys(addressData).forEach((key: string) => {
        const findAddress: Address[] = this.addresses.filter(
          (address: any) => address[key] === addressData[key],
        );

        findAddress.forEach(eachAddress => {
          const addressIndex: number = this.addresses.findIndex(
            address => address.id === eachAddress.id,
          );

          this.addresses.splice(addressIndex, 1);
        });
      });
    }
  }

  public async softDelete(addressData: Address | IObjectDTO): Promise<void> {
    if (addressData instanceof Address) {
      const findAddress: number = this.addresses.findIndex(
        (address: any) => address.id === addressData.id,
      );

      this.addresses[findAddress].deleted_at = new Date();
    } else {
      Object.keys(addressData).forEach((key: string) => {
        const findAddress: Address[] = this.addresses.filter(
          (address: any) => address[key] === addressData[key],
        );

        findAddress.forEach(eachAddress => {
          const addressIndex: number = this.addresses.findIndex(
            address => address.id === eachAddress.id,
          );

          this.addresses[addressIndex].deleted_at = new Date();
        });
      });
    }
  }
}

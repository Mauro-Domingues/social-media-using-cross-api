import IAddressDTO from '@modules/users/dtos/IAddressDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAddressService from './CreateAddressService';

export default class CreateAddressController {
  async handle(request: Request, response: Response) {
    const addressData: IAddressDTO = request.body;
    addressData.user_id = request.user.id;

    const createAddress = container.resolve(CreateAddressService);

    const address = await createAddress.execute(addressData);

    return response.send(address);
  }
}

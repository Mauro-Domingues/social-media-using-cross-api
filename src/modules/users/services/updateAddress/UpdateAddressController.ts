import { Request, Response } from 'express';
import { container } from 'tsyringe';

import IAddressDTO from '@modules/users/dtos/IAddressDTO';
import IObjectDTO from '@dtos/IObjectDTO';
import UpdateAddressService from './UpdateAddressService';

export default class UpdateAddressController {
  async handle(request: Request, response: Response) {
    const updateAddress = container.resolve(UpdateAddressService);

    const addressParam: IObjectDTO = request.params;
    const addressData: IAddressDTO = request.body;
    addressData.user_id = request.user.id;

    const address = await updateAddress.execute(addressParam, addressData);

    return response.send(address);
  }
}

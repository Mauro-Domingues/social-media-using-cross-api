import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteAddressService from './DeleteAddressService';

export default class DeleteAddressController {
  async handle(request: Request, response: Response) {
    const deleteAddress = container.resolve(DeleteAddressService);

    const addressParam: IObjectDTO = request.params;

    const address = await deleteAddress.execute(addressParam);

    return response.send(address);
  }
}

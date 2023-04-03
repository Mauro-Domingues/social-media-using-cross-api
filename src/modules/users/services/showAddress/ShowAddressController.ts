import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowAddressService from './ShowAddressService';

export default class ShowAddressController {
  async handle(request: Request, response: Response) {
    const showAddress = container.resolve(ShowAddressService);

    const addressParam: IObjectDTO = request.params;

    const address = await showAddress.execute(addressParam);

    return response.send(address);
  }
}

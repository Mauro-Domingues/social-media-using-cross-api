import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListAddressService from './ListAddressService';

export default class ListAddressController {
  async handle(request: Request, response: Response) {
    const listAddress = container.resolve(ListAddressService);

    const { page = 1, limit = 20 } = request.query;

    const addresses = await listAddress.execute(Number(page), Number(limit));

    return response.send(addresses);
  }
}

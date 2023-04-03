import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowUserService from './ShowUserService';

export default class ShowUserController {
  async handle(request: Request, response: Response) {
    const showUser = container.resolve(ShowUserService);

    const userParam: IObjectDTO = request.params;

    const user = await showUser.execute(userParam);

    return response.send(user);
  }
}

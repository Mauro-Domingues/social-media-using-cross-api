import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowSelfUserService from './ShowSelfUserService';

export default class ShowSelfUserController {
  async handle(request: Request, response: Response) {
    const showSelfUser = container.resolve(ShowSelfUserService);

    const userParam: IObjectDTO = { id: request.user.id };

    const user = await showSelfUser.execute(userParam);

    return response.send(user);
  }
}

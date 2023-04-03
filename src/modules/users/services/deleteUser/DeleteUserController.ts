import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteUserService from './DeleteUserService';

export default class DeleteUserController {
  async handle(request: Request, response: Response) {
    const deleteusers = container.resolve(DeleteUserService);

    const userParam: IObjectDTO = request.params;

    const user = await deleteusers.execute(userParam);

    return response.send(user);
  }
}

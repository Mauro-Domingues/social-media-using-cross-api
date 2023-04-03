import { Request, Response } from 'express';
import { container } from 'tsyringe';

import IUserDTO from '@modules/users/dtos/IUserDTO';
import IObjectDTO from '@dtos/IObjectDTO';
import UpdateUserService from './UpdateUserService';

export default class UpdateUserController {
  async handle(request: Request, response: Response) {
    const updateUser = container.resolve(UpdateUserService);

    const userParam: IObjectDTO = { id: request.user.id };
    const userData: IUserDTO = request.body;
    userData.avatar = request.file?.filename;

    const user = await updateUser.execute(userParam, userData);

    return response.send(user);
  }
}

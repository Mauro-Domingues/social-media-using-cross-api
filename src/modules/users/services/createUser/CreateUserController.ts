import IUserDTO from '@modules/users/dtos/IUserDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from './CreateUserService';

export default class CreateUserController {
  async handle(request: Request, response: Response) {
    const userData: IUserDTO = request.body;
    userData.avatar = request.file?.filename;

    const createusers = container.resolve(CreateUserService);

    const user = await createusers.execute(userData);

    return response.send(user);
  }
}

import IAuthDTO from '@modules/users/dtos/IAuthDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from './AuthenticateUserService';

export default class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const userData: IAuthDTO = request.body;

    const authenticateUsers = container.resolve(AuthenticateUserService);

    const user = await authenticateUsers.execute(userData);

    return response.send(user);
  }
}

import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUserService from './ListUserService';

export default class ListUserController {
  async handle(request: Request, response: Response) {
    const listUser = container.resolve(ListUserService);

    const { page = 1, limit = 20 } = request.query;

    const users = await listUser.execute(Number(page), Number(limit));

    return response.send(users);
  }
}

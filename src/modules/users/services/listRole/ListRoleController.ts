import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListRoleService from './ListRoleService';

export default class ListRoleController {
  async handle(request: Request, response: Response) {
    const listRole = container.resolve(ListRoleService);

    const { page = 1, limit = 20 } = request.query;

    const roles = await listRole.execute(Number(page), Number(limit));

    return response.send(roles);
  }
}

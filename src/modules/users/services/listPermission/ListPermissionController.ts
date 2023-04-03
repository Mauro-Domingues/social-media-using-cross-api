import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListPermissionService from './ListPermissionService';

export default class ListPermissionController {
  async handle(request: Request, response: Response) {
    const listPermission = container.resolve(ListPermissionService);

    const { page = 1, limit = 20 } = request.query;

    const permissions = await listPermission.execute(Number(page), Number(limit));

    return response.send(permissions);
  }
}

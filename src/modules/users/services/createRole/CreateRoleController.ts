import IRoleDTO from '@modules/users/dtos/IRoleDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateRoleService from './CreateRoleService';

export default class CreateRoleController {
  async handle(request: Request, response: Response) {
    const roleData: IRoleDTO = request.body;

    const createRole = container.resolve(CreateRoleService);

    const role = await createRole.execute(roleData);

    return response.send(role);
  }
}

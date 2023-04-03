import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteRoleService from './DeleteRoleService';

export default class DeleteRoleController {
  async handle(request: Request, response: Response) {
    const deleteRole = container.resolve(DeleteRoleService);

    const roleParam: IObjectDTO = request.params;

    const role = await deleteRole.execute(roleParam);

    return response.send(role);
  }
}

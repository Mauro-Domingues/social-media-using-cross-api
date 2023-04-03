import { Request, Response } from 'express';
import { container } from 'tsyringe';

import IRoleDTO from '@modules/users/dtos/IRoleDTO';
import IObjectDTO from '@dtos/IObjectDTO';
import UpdateRoleService from './UpdateRoleService';

export default class UpdateRoleController {
  async handle(request: Request, response: Response) {
    const updateRole = container.resolve(UpdateRoleService);

    const roleParam: IObjectDTO = request.params;
    const roleData: IRoleDTO = request.body;

    const role = await updateRole.execute(roleParam, roleData);

    return response.send(role);
  }
}

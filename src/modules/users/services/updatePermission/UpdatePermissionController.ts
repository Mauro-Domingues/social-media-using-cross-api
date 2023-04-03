import { Request, Response } from 'express';
import { container } from 'tsyringe';

import IPermissionDTO from '@modules/users/dtos/IPermissionDTO';
import IObjectDTO from '@dtos/IObjectDTO';
import UpdatePermissionService from './UpdatePermissionService';

export default class UpdatePermissionController {
  async handle(request: Request, response: Response) {
    const updatePermission = container.resolve(UpdatePermissionService);

    const permissionParam: IObjectDTO = request.params;
    const permissionData: IPermissionDTO = request.body;

    const permission = await updatePermission.execute(permissionParam, permissionData);

    return response.send(permission);
  }
}

import IPermissionDTO from '@modules/users/dtos/IPermissionDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreatePermissionService from './CreatePermissionService';

export default class CreatePermissionController {
  async handle(request: Request, response: Response) {
    const permissionData: IPermissionDTO = request.body;

    const createPermission = container.resolve(CreatePermissionService);

    const permission = await createPermission.execute(permissionData);

    return response.send(permission);
  }
}

import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeletePermissionService from './DeletePermissionService';

export default class DeletePermissionController {
  async handle(request: Request, response: Response) {
    const deletePermission = container.resolve(DeletePermissionService);

    const permissionParam: IObjectDTO = request.params;

    const permission = await deletePermission.execute(permissionParam);

    return response.send(permission);
  }
}

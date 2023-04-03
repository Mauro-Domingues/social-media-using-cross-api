import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowPermissionService from './ShowPermissionService';

export default class ShowPermissionController {
  async handle(request: Request, response: Response) {
    const showPermission = container.resolve(ShowPermissionService);

    const permissionParam: IObjectDTO = request.params;

    const permission = await showPermission.execute(permissionParam);

    return response.send(permission);
  }
}

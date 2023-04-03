import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowRoleService from './ShowRoleService';

export default class ShowRoleController {
  async handle(request: Request, response: Response) {
    const showRole = container.resolve(ShowRoleService);

    const roleParam: IObjectDTO = request.params;

    const role = await showRole.execute(roleParam);

    return response.send(role);
  }
}

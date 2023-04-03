import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteProfileService from './DeleteProfileService';

export default class DeleteProfileController {
  async handle(request: Request, response: Response) {
    const deleteProfile = container.resolve(DeleteProfileService);

    const profileParam: IObjectDTO = request.params;

    const profile = await deleteProfile.execute(profileParam);

    return response.send(profile);
  }
}

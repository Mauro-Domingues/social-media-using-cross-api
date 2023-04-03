import IObjectDTO from '@dtos/IObjectDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowProfileService from './ShowProfileService';

export default class ShowProfileController {
  async handle(request: Request, response: Response) {
    const showProfile = container.resolve(ShowProfileService);

    const profileParam: IObjectDTO = request.params;

    const profile = await showProfile.execute(profileParam);

    return response.send(profile);
  }
}

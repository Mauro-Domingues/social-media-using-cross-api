import IProfileDTO from '@modules/users/dtos/IProfileDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateProfileService from './CreateProfileService';

export default class CreateProfileController {
  async handle(request: Request, response: Response) {
    const profileData: IProfileDTO = request.body;
    profileData.avatar = request.file?.filename;

    const createProfile = container.resolve(CreateProfileService);

    const profile = await createProfile.execute(profileData);

    return response.send(profile);
  }
}

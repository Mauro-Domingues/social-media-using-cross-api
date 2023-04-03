import { Request, Response } from 'express';
import { container } from 'tsyringe';

import IProfileDTO from '@modules/users/dtos/IProfileDTO';
import IObjectDTO from '@dtos/IObjectDTO';
import UpdateProfileService from './UpdateProfileService';

export default class UpdateProfileController {
  async handle(request: Request, response: Response) {
    const updateProfile = container.resolve(UpdateProfileService);

    const profileParam: IObjectDTO = request.params;
    const profileData: IProfileDTO = request.body;
    profileData.avatar = request.file?.filename;

    const profile = await updateProfile.execute(profileParam, profileData);

    return response.send(profile);
  }
}

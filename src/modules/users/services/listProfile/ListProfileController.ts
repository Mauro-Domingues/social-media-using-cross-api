import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProfileService from './ListProfileService';

export default class ListProfileController {
  async handle(request: Request, response: Response) {
    const listProfile = container.resolve(ListProfileService);

    const { page = 1, limit = 20 } = request.query;

    const profiles = await listProfile.execute(Number(page), Number(limit));

    return response.send(profiles);
  }
}

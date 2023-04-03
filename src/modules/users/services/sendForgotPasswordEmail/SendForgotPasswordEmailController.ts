import IUserDTO from '@modules/users/dtos/IUserDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

export default class SendForgotPasswordEmailController {
  async handle(request: Request, response: Response) {
    const userData: Pick<IUserDTO, 'email'> = request.body;

    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendForgotPasswordEmail.execute(userData);

    return response.status(200).send({});
  }
}

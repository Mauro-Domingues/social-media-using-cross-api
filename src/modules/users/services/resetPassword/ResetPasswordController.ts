import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from './ResetPasswordService';

export default class ResetPasswordController {
  async handle(request: Request, response: Response) {
    const { password } = request.body;
    const { token } = request.params;

    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute(token, password);

    return response.status(200).send({});
  }
}

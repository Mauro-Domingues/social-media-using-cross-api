import path from 'path';
import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';

import ICryptoProvider from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';
import IUserDTO from '@modules/users/dtos/IUserDTO';
import IUsersRepository from '../../repositories/IUsersRepository';

@injectable()
export default class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('CryptoProvider')
    private cryptoProvider: ICryptoProvider,
  ) {}

  async execute(userParam: Pick<IUserDTO, 'email'>): Promise<void> {
    const user = await this.usersRepository.findBy(userParam, ['profile']);

    if (!user) {
      throw new AppError('User does not exist');
    }

    const { jwt_token } = await this.cryptoProvider.generateJwt({
      user_id: user.id,
    });

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.profile.name || '',
        email: user.email,
      },
      subject: '[Enzo Pneus] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.profile.name || '',
          link: `${process.env.WEB_URL}/passwords/reset?token=${jwt_token}`,
        },
      },
    });
  }
}

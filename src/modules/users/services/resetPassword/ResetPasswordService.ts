import { injectable, inject } from 'tsyringe';
import { verify } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute(password: string, token: string): Promise<void> {
    const basePath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'assets',
      'keys',
      'private.pem',
    );

    const secret = fs.readFileSync(basePath, 'ascii');
    const decoded = verify(token, secret);
    const { sub } = decoded;

    const user = await this.usersRepository.findBy({ id: sub });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.update(user);
  }
}

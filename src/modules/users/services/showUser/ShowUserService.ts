import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/entities/User';
import IObjectDTO from '@dtos/IObjectDTO';
import IResponseDTO from '@dtos/IResponseDTO';
import { instanceToInstance } from 'class-transformer';

@injectable()
export default class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(userParam: IObjectDTO): Promise<IResponseDTO<User>> {
    const user = await this.usersRepository.findBy(userParam);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'User found successfully',
      data: instanceToInstance(user),
    };
  }
}

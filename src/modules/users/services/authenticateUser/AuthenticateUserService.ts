import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IResponseDTO from '@dtos/IResponseDTO';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import ICryptoProvider from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';
import ITokensRepository from '@modules/users/repositories/ITokensRepository';
import IAuthDTO from '@modules/users/dtos/IAuthDTO';

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('TokensRepository')
    private tokensRepository: ITokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CryptoProvider')
    private cryptoProvider: ICryptoProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute({ email, password, refresh_token }: IAuthDTO): Promise<
    IResponseDTO<{
      jwt_token: string;
      refresh_token?: string;
    }>
  > {
    if (refresh_token) {
      const token = await this.tokensRepository.findBy({
        token: refresh_token,
      });

      if (!token) {
        throw new AppError('Invalid token', 401);
      }

      const tokens: {
        jwt_token: string;
        refresh_token?: string;
      } = await this.cryptoProvider.generateJwt({}, { subject: token.user_id });

      delete tokens.refresh_token;

      return {
        code: 200,
        message_code: 'AUTHENTICATED',
        message: 'Successfully authenticated user',
        data: tokens,
      };
    }

    const checkUser = await this.usersRepository.findBy({
      email,
    });

    if (!checkUser) {
      throw new AppError('Invalid email/password combination', 401);
    }

    const checkPassword = await this.hashProvider.compareHash(
      password,
      checkUser.password,
    );

    if (!checkPassword) {
      throw new AppError('Invalid email/password combination', 401);
    }

    const tokens = await this.cryptoProvider.generateJwt(
      {},
      { subject: checkUser.id },
    );

    const checkToken = await this.tokensRepository.findBy({
      user_id: checkUser.id,
    });

    if (!checkToken) {
      await this.tokensRepository.create({
        user_id: checkUser.id,
        token: tokens.refresh_token,
      });
    } else {
      checkToken.token = tokens.refresh_token;
      await this.tokensRepository.update(checkToken);
    }

    await this.cacheProvider.invalidatePrefix('users');

    return {
      code: 200,
      message_code: 'AUTHENTICATED',
      message: 'Successfully authenticated user',
      data: tokens,
    };
  }
}

import ITokenDTO from '@modules/users/dtos/ITokenDTO';
import { DeleteResult, Repository } from 'typeorm';

import Token from '@modules/users/entities/Token';
import ITokensRepository from '@modules/users/repositories/ITokensRepository';
import { AppDataSource } from '@shared/typeorm/dataSource';
import IObjectDTO from '@dtos/IObjectDTO';

export default class TokensRepository implements ITokensRepository {
  private ormRepository: Repository<Token>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Token);
  }

  public async findBy(
    tokenData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Token | null> {
    const token = await this.ormRepository.findOne({
      where: tokenData,
      relations,
    });

    return token;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ tokens: Token[]; amount: number }> {
    const [tokens, amount] = await this.ormRepository.findAndCount({
      where: conditions,
      take: limit,
      skip: (page - 1) * limit,
      relations,
    });

    return { tokens, amount };
  }

  public async create(tokenData: ITokenDTO): Promise<Token> {
    const token = this.ormRepository.create(tokenData);

    await this.ormRepository.save(token);

    return token;
  }

  public async update(tokenData: Token): Promise<Token> {
    return this.ormRepository.save(tokenData);
  }

  public async delete(tokenData: Token | IObjectDTO): Promise<DeleteResult> {
    if (tokenData instanceof Token) {
      return this.ormRepository.delete({ id: tokenData.id });
    }
    return this.ormRepository.delete(tokenData);
  }

  public async softDelete(
    tokenData: Token | IObjectDTO,
  ): Promise<DeleteResult> {
    if (tokenData instanceof Token) {
      return this.ormRepository.softDelete({ id: tokenData.id });
    }
    return this.ormRepository.softDelete(tokenData);
  }
}

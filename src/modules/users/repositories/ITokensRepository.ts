import Token from '@modules/users/entities/Token';
import ITokenDTO from '@modules/users/dtos/ITokenDTO';
import { DeleteResult } from 'typeorm';
import IObjectDTO from '@dtos/IObjectDTO';

export default interface ITokensRepository {
  findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ tokens: Token[]; amount: number }>;
  findBy(
    tokenData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Token | null>;
  create(tokenData: ITokenDTO): Promise<Token>;
  update(tokenData: Token): Promise<Token>;
  delete(tokenData: Token | IObjectDTO): Promise<DeleteResult | void>;
  softDelete(tokenData: Token | IObjectDTO): Promise<DeleteResult | void>;
}

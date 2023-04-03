/* eslint-disable @typescript-eslint/no-explicit-any */
import IObjectDTO from '@dtos/IObjectDTO';
import ITokenDTO from '@modules/users/dtos/ITokenDTO';
import Token from '@modules/users/entities/Token';
import ITokensRepository from '@modules/users/repositories/ITokensRepository';
import { v4 as uuid } from 'uuid';

export default class FakeTokensRepository implements ITokensRepository {
  private tokens: Token[] = [];

  public async findBy(
    tokenData: IObjectDTO | IObjectDTO[],
  ): Promise<Token | null> {
    let findToken: Token | undefined;
    if (tokenData && Array.isArray(tokenData)) {
      tokenData.forEach((data: IObjectDTO) => {
        Object.keys(data).forEach((key: string) => {
          findToken = this.tokens.find(
            (token: any) => token[key] === data[key],
          );
        });
      });
    } else if (tokenData) {
      Object.keys(tokenData).forEach((key: string) => {
        findToken = this.tokens.find(
          (token: any) => token[key] === tokenData[key],
        );
      });
    }

    if (!findToken) {
      return null;
    }
    return findToken;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
  ): Promise<{ tokens: Token[]; amount: number }> {
    const filterTokens: Token[] = [];
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach((condition: IObjectDTO) => {
        Object.keys(condition).forEach((key: string) => {
          const applyFilter: Token[] = this.tokens.filter(
            (token: any) => token[key] === condition[key],
          );

          applyFilter.forEach((token: Token) => filterTokens.push(token));
        });
      });
    } else if (conditions) {
      let applyFilter: Token[] = this.tokens;
      Object.keys(conditions).forEach((key: string) => {
        applyFilter = applyFilter.filter(
          (token: any) => token[key] === conditions[key],
        );
      });

      applyFilter.forEach((token: Token) => filterTokens.push(token));
    } else {
      this.tokens.forEach((token: Token) => filterTokens.push(token));
    }

    const filtredTokens = filterTokens.slice((page - 1) * limit, page * limit);

    return { tokens: filtredTokens, amount: filterTokens.length };
  }

  public async create(tokenData: ITokenDTO): Promise<Token> {
    const token: Token = new Token();

    Object.assign(token, { id: uuid() }, tokenData);
    this.tokens.push(token);

    return token;
  }

  public async update(tokenData: Token): Promise<Token> {
    const findToken: number = this.tokens.findIndex(
      token => token.id === tokenData.id,
    );

    this.tokens[findToken] = tokenData;

    return tokenData;
  }

  public async delete(tokenData: Token | IObjectDTO): Promise<void> {
    if (tokenData instanceof Token) {
      const findToken: number = this.tokens.findIndex(
        token => token.id === tokenData.id,
      );

      this.tokens.splice(findToken, 1);
    } else {
      Object.keys(tokenData).forEach((key: string) => {
        const findToken: Token[] = this.tokens.filter(
          (token: any) => token[key] === tokenData[key],
        );

        findToken.forEach(eachToken => {
          const tokenIndex: number = this.tokens.findIndex(
            token => token.id === eachToken.id,
          );

          this.tokens.splice(tokenIndex, 1);
        });
      });
    }
  }

  public async softDelete(tokenData: Token | IObjectDTO): Promise<void> {
    if (tokenData instanceof Token) {
      const findToken: number = this.tokens.findIndex(
        (token: any) => token.id === tokenData.id,
      );

      this.tokens[findToken].deleted_at = new Date();
    } else {
      Object.keys(tokenData).forEach((key: string) => {
        const findToken: Token[] = this.tokens.filter(
          (token: any) => token[key] === tokenData[key],
        );

        findToken.forEach(eachToken => {
          const tokenIndex: number = this.tokens.findIndex(
            token => token.id === eachToken.id,
          );

          this.tokens[tokenIndex].deleted_at = new Date();
        });
      });
    }
  }
}

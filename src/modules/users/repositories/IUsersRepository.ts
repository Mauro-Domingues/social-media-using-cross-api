import User from '@modules/users/entities/User';
import IUserDTO from '@modules/users/dtos/IUserDTO';
import { DeleteResult } from 'typeorm';
import IObjectDTO from '@dtos/IObjectDTO';

export default interface IUsersRepository {
  findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ users: User[]; amount: number }>;
  findBy(
    userData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<User | null>;
  create(userData: IUserDTO): Promise<User>;
  update(userData: User): Promise<User>;
  delete(userData: User | IObjectDTO): Promise<DeleteResult | void>;
  softDelete(userData: User | IObjectDTO): Promise<DeleteResult | void>;
}

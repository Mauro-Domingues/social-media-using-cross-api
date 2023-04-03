import IUserDTO from '@modules/users/dtos/IUserDTO';
import { DeleteResult, Repository } from 'typeorm';

import User from '@modules/users/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { AppDataSource } from '@shared/typeorm/dataSource';
import IObjectDTO from '@dtos/IObjectDTO';

export default class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User);
  }

  public async findBy(
    userData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<User | null> {
    const user = await this.ormRepository.findOne({
      where: userData,
      relations,
    });

    return user;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ users: User[]; amount: number }> {
    const [users, amount] = await this.ormRepository.findAndCount({
      where: conditions,
      take: limit,
      skip: (page - 1) * limit,
      relations,
    });

    return { users, amount };
  }

  public async create(userData: IUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async update(userData: User): Promise<User> {
    return this.ormRepository.save(userData);
  }

  public async delete(userData: User | IObjectDTO): Promise<DeleteResult> {
    if (userData instanceof User) {
      return this.ormRepository.delete({ id: userData.id });
    }
    return this.ormRepository.delete(userData);
  }

  public async softDelete(userData: User | IObjectDTO): Promise<DeleteResult> {
    if (userData instanceof User) {
      return this.ormRepository.softDelete({ id: userData.id });
    }
    return this.ormRepository.softDelete(userData);
  }
}

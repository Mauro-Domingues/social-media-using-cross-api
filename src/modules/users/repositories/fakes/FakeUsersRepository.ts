/* eslint-disable @typescript-eslint/no-explicit-any */
import IObjectDTO from '@dtos/IObjectDTO';
import IUserDTO from '@modules/users/dtos/IUserDTO';
import User from '@modules/users/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { v4 as uuid } from 'uuid';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findBy(
    userData: IObjectDTO | IObjectDTO[],
  ): Promise<User | null> {
    let findUser: User | undefined;
    if (userData && Array.isArray(userData)) {
      userData.forEach((data: IObjectDTO) => {
        Object.keys(data).forEach((key: string) => {
          findUser = this.users.find((user: any) => user[key] === data[key]);
        });
      });
    } else if (userData) {
      Object.keys(userData).forEach((key: string) => {
        findUser = this.users.find((user: any) => user[key] === userData[key]);
      });
    }

    if (!findUser) {
      return null;
    }
    return findUser;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
  ): Promise<{ users: User[]; amount: number }> {
    const filterUsers: User[] = [];
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach((condition: IObjectDTO) => {
        Object.keys(condition).forEach((key: string) => {
          const applyFilter: User[] = this.users.filter(
            (user: any) => user[key] === condition[key],
          );

          applyFilter.forEach((user: User) => filterUsers.push(user));
        });
      });
    } else if (conditions) {
      let applyFilter: User[] = this.users;
      Object.keys(conditions).forEach((key: string) => {
        applyFilter = applyFilter.filter(
          (user: any) => user[key] === conditions[key],
        );
      });

      applyFilter.forEach((user: User) => filterUsers.push(user));
    } else {
      this.users.forEach((user: User) => filterUsers.push(user));
    }

    const filtredUsers = filterUsers.slice((page - 1) * limit, page * limit);

    return { users: filtredUsers, amount: filterUsers.length };
  }

  public async create(userData: IUserDTO): Promise<User> {
    const user: User = new User();

    Object.assign(user, { id: uuid() }, userData);
    this.users.push(user);

    return user;
  }

  public async update(userData: User): Promise<User> {
    const findUser: number = this.users.findIndex(
      user => user.id === userData.id,
    );

    this.users[findUser] = userData;

    return userData;
  }

  public async delete(userData: User | IObjectDTO): Promise<void> {
    if (userData instanceof User) {
      const findUser: number = this.users.findIndex(
        user => user.id === userData.id,
      );

      this.users.splice(findUser, 1);
    } else {
      Object.keys(userData).forEach((key: string) => {
        const findUser: User[] = this.users.filter(
          (user: any) => user[key] === userData[key],
        );

        findUser.forEach(eachUser => {
          const userIndex: number = this.users.findIndex(
            user => user.id === eachUser.id,
          );

          this.users.splice(userIndex, 1);
        });
      });
    }
  }

  public async softDelete(userData: User | IObjectDTO): Promise<void> {
    if (userData instanceof User) {
      const findUser: number = this.users.findIndex(
        (user: any) => user.id === userData.id,
      );

      this.users[findUser].deleted_at = new Date();
    } else {
      Object.keys(userData).forEach((key: string) => {
        const findUser: User[] = this.users.filter(
          (user: any) => user[key] === userData[key],
        );

        findUser.forEach(eachUser => {
          const userIndex: number = this.users.findIndex(
            user => user.id === eachUser.id,
          );

          this.users[userIndex].deleted_at = new Date();
        });
      });
    }
  }
}

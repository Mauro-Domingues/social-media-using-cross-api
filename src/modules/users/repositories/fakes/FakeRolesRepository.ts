/* eslint-disable @typescript-eslint/no-explicit-any */
import IObjectDTO from '@dtos/IObjectDTO';
import IRoleDTO from '@modules/users/dtos/IRoleDTO';
import Role from '@modules/users/entities/Role';
import IRolesRepository from '@modules/users/repositories/IRolesRepository';
import { v4 as uuid } from 'uuid';

export default class FakeRolesRepository implements IRolesRepository {
  findMany(): Promise<Role[]> {
    throw new Error('Method not implemented.');
  }

  findLike(): Promise<Role[]> {
    throw new Error('Method not implemented.');
  }

  private roles: Role[] = [];

  public async findBy(
    roleData: IObjectDTO | IObjectDTO[],
  ): Promise<Role | null> {
    let findRole: Role | undefined;
    if (roleData && Array.isArray(roleData)) {
      roleData.forEach((data: IObjectDTO) => {
        Object.keys(data).forEach((key: string) => {
          findRole = this.roles.find((role: any) => role[key] === data[key]);
        });
      });
    } else if (roleData) {
      Object.keys(roleData).forEach((key: string) => {
        findRole = this.roles.find((role: any) => role[key] === roleData[key]);
      });
    }

    if (!findRole) {
      return null;
    }
    return findRole;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
  ): Promise<{ roles: Role[]; amount: number }> {
    const filterRoles: Role[] = [];
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach((condition: IObjectDTO) => {
        Object.keys(condition).forEach((key: string) => {
          const applyFilter: Role[] = this.roles.filter(
            (role: any) => role[key] === condition[key],
          );

          applyFilter.forEach((role: Role) => filterRoles.push(role));
        });
      });
    } else if (conditions) {
      let applyFilter: Role[] = this.roles;
      Object.keys(conditions).forEach((key: string) => {
        applyFilter = applyFilter.filter(
          (role: any) => role[key] === conditions[key],
        );
      });

      applyFilter.forEach((role: Role) => filterRoles.push(role));
    } else {
      this.roles.forEach((role: Role) => filterRoles.push(role));
    }

    const filtredRoles = filterRoles.slice((page - 1) * limit, page * limit);

    return { roles: filtredRoles, amount: filterRoles.length };
  }

  public async create(roleData: IRoleDTO): Promise<Role> {
    const role: Role = new Role();

    Object.assign(role, { id: uuid() }, roleData);
    this.roles.push(role);

    return role;
  }

  public async update(roleData: Role): Promise<Role> {
    const findRole: number = this.roles.findIndex(
      role => role.id === roleData.id,
    );

    this.roles[findRole] = roleData;

    return roleData;
  }

  public async delete(roleData: Role | IObjectDTO): Promise<void> {
    if (roleData instanceof Role) {
      const findRole: number = this.roles.findIndex(
        role => role.id === roleData.id,
      );

      this.roles.splice(findRole, 1);
    } else {
      Object.keys(roleData).forEach((key: string) => {
        const findRole: Role[] = this.roles.filter(
          (role: any) => role[key] === roleData[key],
        );

        findRole.forEach(eachRole => {
          const roleIndex: number = this.roles.findIndex(
            role => role.id === eachRole.id,
          );

          this.roles.splice(roleIndex, 1);
        });
      });
    }
  }

  public async softDelete(roleData: Role | IObjectDTO): Promise<void> {
    if (roleData instanceof Role) {
      const findRole: number = this.roles.findIndex(
        (role: any) => role.id === roleData.id,
      );

      this.roles[findRole].deleted_at = new Date();
    } else {
      Object.keys(roleData).forEach((key: string) => {
        const findRole: Role[] = this.roles.filter(
          (role: any) => role[key] === roleData[key],
        );

        findRole.forEach(eachRole => {
          const roleIndex: number = this.roles.findIndex(
            role => role.id === eachRole.id,
          );

          this.roles[roleIndex].deleted_at = new Date();
        });
      });
    }
  }
}

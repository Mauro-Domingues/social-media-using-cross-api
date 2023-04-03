import Role from '@modules/users/entities/Role';
import IRoleDTO from '@modules/users/dtos/IRoleDTO';
import { DeleteResult } from 'typeorm';
import IObjectDTO from '@dtos/IObjectDTO';

export default interface IRolesRepository {
  findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ roles: Role[]; amount: number }>;
  findBy(
    roleData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Role | null>;
  findMany(
    roleData: string[],
    property: string,
    relations?: string[],
  ): Promise<Role[]>;
  findLike(
    roleData: Partial<Role>,
    select?: { [key: string]: boolean },
    order?: { [key: string]: 'asc' | 'desc' },
    limit?: number,
  ): Promise<Role[]>;
  create(roleData: IRoleDTO): Promise<Role>;
  update(roleData: Role): Promise<Role>;
  delete(roleData: Role | IObjectDTO): Promise<DeleteResult | void>;
  softDelete(roleData: Role | IObjectDTO): Promise<DeleteResult | void>;
}

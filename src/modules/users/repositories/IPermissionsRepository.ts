import Permission from '@modules/users/entities/Permission';
import IPermissionDTO from '@modules/users/dtos/IPermissionDTO';
import { DeleteResult } from 'typeorm';
import IObjectDTO from '@dtos/IObjectDTO';

export default interface IPermissionsRepository {
  findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ permissions: Permission[]; amount: number }>;
  findBy(
    permissionData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Permission | null>;
  findMany(
    permissionData: string[],
    property: string,
    relations?: string[],
  ): Promise<Permission[]>;
  findLike(
    permissionData: Partial<Permission>,
    select?: { [key: string]: boolean },
    order?: { [key: string]: 'asc' | 'desc' },
    limit?: number,
  ): Promise<Permission[]>;
  create(permissionData: IPermissionDTO): Promise<Permission>;
  update(permissionData: Permission): Promise<Permission>;
  delete(permissionData: Permission | IObjectDTO): Promise<DeleteResult | void>;
  softDelete(
    permissionData: Permission | IObjectDTO,
  ): Promise<DeleteResult | void>;
}

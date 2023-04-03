/* eslint-disable @typescript-eslint/no-explicit-any */
import IObjectDTO from '@dtos/IObjectDTO';
import IPermissionDTO from '@modules/users/dtos/IPermissionDTO';
import Permission from '@modules/users/entities/Permission';
import IPermissionsRepository from '@modules/users/repositories/IPermissionsRepository';
import { v4 as uuid } from 'uuid';

export default class FakePermissionsRepository
  implements IPermissionsRepository
{
  findLike(): Promise<Permission[]> {
    throw new Error('Method not implemented.');
  }

  findMany(): Promise<Permission[]> {
    throw new Error('Method not implemented.');
  }

  private permissions: Permission[] = [];

  public async findBy(
    permissionData: IObjectDTO | IObjectDTO[],
  ): Promise<Permission | null> {
    let findPermission: Permission | undefined;
    if (permissionData && Array.isArray(permissionData)) {
      permissionData.forEach((data: IObjectDTO) => {
        Object.keys(data).forEach((key: string) => {
          findPermission = this.permissions.find(
            (permission: any) => permission[key] === data[key],
          );
        });
      });
    } else if (permissionData) {
      Object.keys(permissionData).forEach((key: string) => {
        findPermission = this.permissions.find(
          (permission: any) => permission[key] === permissionData[key],
        );
      });
    }

    if (!findPermission) {
      return null;
    }
    return findPermission;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
  ): Promise<{ permissions: Permission[]; amount: number }> {
    const filterPermissions: Permission[] = [];
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach((condition: IObjectDTO) => {
        Object.keys(condition).forEach((key: string) => {
          const applyFilter: Permission[] = this.permissions.filter(
            (permission: any) => permission[key] === condition[key],
          );

          applyFilter.forEach((permission: Permission) =>
            filterPermissions.push(permission),
          );
        });
      });
    } else if (conditions) {
      let applyFilter: Permission[] = this.permissions;
      Object.keys(conditions).forEach((key: string) => {
        applyFilter = applyFilter.filter(
          (permission: any) => permission[key] === conditions[key],
        );
      });

      applyFilter.forEach((permission: Permission) =>
        filterPermissions.push(permission),
      );
    } else {
      this.permissions.forEach((permission: Permission) =>
        filterPermissions.push(permission),
      );
    }

    const filtredPermissions = filterPermissions.slice(
      (page - 1) * limit,
      page * limit,
    );

    return {
      permissions: filtredPermissions,
      amount: filterPermissions.length,
    };
  }

  public async create(permissionData: IPermissionDTO): Promise<Permission> {
    const permission: Permission = new Permission();

    Object.assign(permission, { id: uuid() }, permissionData);
    this.permissions.push(permission);

    return permission;
  }

  public async update(permissionData: Permission): Promise<Permission> {
    const findPermission: number = this.permissions.findIndex(
      permission => permission.id === permissionData.id,
    );

    this.permissions[findPermission] = permissionData;

    return permissionData;
  }

  public async delete(permissionData: Permission | IObjectDTO): Promise<void> {
    if (permissionData instanceof Permission) {
      const findPermission: number = this.permissions.findIndex(
        permission => permission.id === permissionData.id,
      );

      this.permissions.splice(findPermission, 1);
    } else {
      Object.keys(permissionData).forEach((key: string) => {
        const findPermission: Permission[] = this.permissions.filter(
          (permission: any) => permission[key] === permissionData[key],
        );

        findPermission.forEach(eachPermission => {
          const permissionIndex: number = this.permissions.findIndex(
            permission => permission.id === eachPermission.id,
          );

          this.permissions.splice(permissionIndex, 1);
        });
      });
    }
  }

  public async softDelete(
    permissionData: Permission | IObjectDTO,
  ): Promise<void> {
    if (permissionData instanceof Permission) {
      const findPermission: number = this.permissions.findIndex(
        (permission: any) => permission.id === permissionData.id,
      );

      this.permissions[findPermission].deleted_at = new Date();
    } else {
      Object.keys(permissionData).forEach((key: string) => {
        const findPermission: Permission[] = this.permissions.filter(
          (permission: any) => permission[key] === permissionData[key],
        );

        findPermission.forEach(eachPermission => {
          const permissionIndex: number = this.permissions.findIndex(
            permission => permission.id === eachPermission.id,
          );

          this.permissions[permissionIndex].deleted_at = new Date();
        });
      });
    }
  }
}

import IPermissionDTO from '@modules/users/dtos/IPermissionDTO';
import { DeleteResult, In, Like, Repository } from 'typeorm';

import Permission from '@modules/users/entities/Permission';
import IPermissionsRepository from '@modules/users/repositories/IPermissionsRepository';
import { AppDataSource } from '@shared/typeorm/dataSource';
import IObjectDTO from '@dtos/IObjectDTO';

export default class PermissionsRepository implements IPermissionsRepository {
  private ormRepository: Repository<Permission>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Permission);
  }

  public async findBy(
    permissionData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Permission | null> {
    const permission = await this.ormRepository.findOne({
      where: permissionData,
      relations,
    });

    return permission;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ permissions: Permission[]; amount: number }> {
    const [permissions, amount] = await this.ormRepository.findAndCount({
      where: conditions,
      take: limit,
      skip: (page - 1) * limit,
      relations,
    });

    return { permissions, amount };
  }

  public async findMany(
    permissionData: string[],
    property: string,
    relations?: string[],
  ): Promise<Permission[]> {
    const permissions = await this.ormRepository.find({
      where: { [property]: In(permissionData) },
      relations,
    });

    return permissions;
  }

  public async findLike(
    permissionData: Partial<Permission>,
    select?: { [key: string]: boolean },
    order?: { [key: string]: 'asc' | 'desc' },
    limit?: number,
  ): Promise<Permission[]> {
    const permissions = await this.ormRepository.find({
      select,
      where: {
        [Object.keys(permissionData)[0]]: Like(
          Object.values(permissionData)[0],
        ),
      },
      order,
      take: limit,
    });

    return permissions;
  }

  public async create(permissionData: IPermissionDTO): Promise<Permission> {
    const permission = this.ormRepository.create(permissionData);

    await this.ormRepository.save(permission);

    return permission;
  }

  public async update(permissionData: Permission): Promise<Permission> {
    return this.ormRepository.save(permissionData);
  }

  public async delete(
    permissionData: Permission | IObjectDTO,
  ): Promise<DeleteResult> {
    if (permissionData instanceof Permission) {
      return this.ormRepository.delete({ id: permissionData.id });
    }
    return this.ormRepository.delete(permissionData);
  }

  public async softDelete(
    permissionData: Permission | IObjectDTO,
  ): Promise<DeleteResult> {
    if (permissionData instanceof Permission) {
      return this.ormRepository.softDelete({ id: permissionData.id });
    }
    return this.ormRepository.softDelete(permissionData);
  }
}

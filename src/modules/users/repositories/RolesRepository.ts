import IRoleDTO from '@modules/users/dtos/IRoleDTO';
import { DeleteResult, In, Like, Repository } from 'typeorm';

import Role from '@modules/users/entities/Role';
import IRolesRepository from '@modules/users/repositories/IRolesRepository';
import { AppDataSource } from '@shared/typeorm/dataSource';
import IObjectDTO from '@dtos/IObjectDTO';

export default class RolesRepository implements IRolesRepository {
  private ormRepository: Repository<Role>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Role);
  }

  public async findBy(
    roleData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Role | null> {
    const role = await this.ormRepository.findOne({
      where: roleData,
      relations,
    });

    return role;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ roles: Role[]; amount: number }> {
    const [roles, amount] = await this.ormRepository.findAndCount({
      where: conditions,
      take: limit,
      skip: (page - 1) * limit,
      relations,
    });

    return { roles, amount };
  }

  public async findMany(
    roleData: string[],
    property: string,
    relations?: string[],
  ): Promise<Role[]> {
    const roles = await this.ormRepository.find({
      where: { [property]: In(roleData) },
      relations,
    });

    return roles;
  }

  public async findLike(
    roleData: Partial<Role>,
    select?: { [key: string]: boolean },
    order?: { [key: string]: 'asc' | 'desc' },
    limit?: number,
  ): Promise<Role[]> {
    const roles = await this.ormRepository.find({
      select,
      where: { [Object.keys(roleData)[0]]: Like(Object.values(roleData)[0]) },
      order,
      take: limit,
    });

    return roles;
  }

  public async create(roleData: IRoleDTO): Promise<Role> {
    const role = this.ormRepository.create(roleData);

    await this.ormRepository.save(role);

    return role;
  }

  public async update(roleData: Role): Promise<Role> {
    return this.ormRepository.save(roleData);
  }

  public async delete(roleData: Role | IObjectDTO): Promise<DeleteResult> {
    if (roleData instanceof Role) {
      return this.ormRepository.delete({ id: roleData.id });
    }
    return this.ormRepository.delete(roleData);
  }

  public async softDelete(roleData: Role | IObjectDTO): Promise<DeleteResult> {
    if (roleData instanceof Role) {
      return this.ormRepository.softDelete({ id: roleData.id });
    }
    return this.ormRepository.softDelete(roleData);
  }
}

import IProfileDTO from '@modules/users/dtos/IProfileDTO';
import { DeleteResult, Repository } from 'typeorm';

import Profile from '@modules/users/entities/Profile';
import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';
import { AppDataSource } from '@shared/typeorm/dataSource';
import IObjectDTO from '@dtos/IObjectDTO';

export default class ProfilesRepository implements IProfilesRepository {
  private ormRepository: Repository<Profile>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Profile);
  }

  public async findBy(
    profileData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Profile | null> {
    const profile = await this.ormRepository.findOne({
      where: profileData,
      relations,
    });

    return profile;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ profiles: Profile[]; amount: number }> {
    const [profiles, amount] = await this.ormRepository.findAndCount({
      where: conditions,
      take: limit,
      skip: (page - 1) * limit,
      relations,
    });

    return { profiles, amount };
  }

  public async create(profileData: IProfileDTO): Promise<Profile> {
    const profile = this.ormRepository.create(profileData);

    await this.ormRepository.save(profile);

    return profile;
  }

  public async update(profileData: Profile): Promise<Profile> {
    return this.ormRepository.save(profileData);
  }

  public async delete(profileData: Profile | IObjectDTO): Promise<DeleteResult> {
    if (profileData instanceof Profile) {
      return this.ormRepository.delete({ id: profileData.id });
    }
    return this.ormRepository.delete(profileData);
  }

  public async softDelete(profileData: Profile | IObjectDTO): Promise<DeleteResult> {
    if (profileData instanceof Profile) {
      return this.ormRepository.softDelete({ id: profileData.id });
    }
    return this.ormRepository.softDelete(profileData);
  }
}

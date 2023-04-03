import Profile from '@modules/users/entities/Profile';
import IProfileDTO from '@modules/users/dtos/IProfileDTO';
import { DeleteResult } from 'typeorm';
import IObjectDTO from '@dtos/IObjectDTO';

export default interface IProfilesRepository {
  findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<{ profiles: Profile[]; amount: number }>;
  findBy(
    profileData: IObjectDTO | IObjectDTO[],
    relations?: string[],
  ): Promise<Profile | null>;
  create(profileData: IProfileDTO): Promise<Profile>;
  update(profileData: Profile): Promise<Profile>;
  delete(profileData: Profile | IObjectDTO): Promise<DeleteResult | void>;
  softDelete(profileData: Profile | IObjectDTO): Promise<DeleteResult | void>;
}

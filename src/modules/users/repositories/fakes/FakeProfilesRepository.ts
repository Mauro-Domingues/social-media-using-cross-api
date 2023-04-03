/* eslint-disable @typescript-eslint/no-explicit-any */
import IObjectDTO from '@dtos/IObjectDTO';
import IProfileDTO from '@modules/users/dtos/IProfileDTO';
import Profile from '@modules/users/entities/Profile';
import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';
import { v4 as uuid } from 'uuid';

export default class FakeProfilesRepository implements IProfilesRepository {
  private profiles: Profile[] = [];

  public async findBy(
    profileData: IObjectDTO | IObjectDTO[],
  ): Promise<Profile | null> {
    let findProfile: Profile | undefined;
    if (profileData && Array.isArray(profileData)) {
      profileData.forEach((data: IObjectDTO) => {
        Object.keys(data).forEach((key: string) => {
          findProfile = this.profiles.find(
            (profile: any) => profile[key] === data[key],
          );
        });
      });
    } else if (profileData) {
      Object.keys(profileData).forEach((key: string) => {
        findProfile = this.profiles.find(
          (profile: any) => profile[key] === profileData[key],
        );
      });
    }

    if (!findProfile) {
      return null;
    }
    return findProfile;
  }

  public async findAll(
    page: number,
    limit: number,
    conditions?: IObjectDTO | IObjectDTO[],
  ): Promise<{ profiles: Profile[]; amount: number }> {
    const filterProfiles: Profile[] = [];
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach((condition: IObjectDTO) => {
        Object.keys(condition).forEach((key: string) => {
          const applyFilter: Profile[] = this.profiles.filter(
            (profile: any) => profile[key] === condition[key],
          );

          applyFilter.forEach((profile: Profile) => filterProfiles.push(profile));
        });
      });
    } else if (conditions) {
      let applyFilter: Profile[] = this.profiles;
      Object.keys(conditions).forEach((key: string) => {
        applyFilter = applyFilter.filter(
          (profile: any) => profile[key] === conditions[key],
        );
      });

      applyFilter.forEach((profile: Profile) => filterProfiles.push(profile));
    } else {
      this.profiles.forEach((profile: Profile) => filterProfiles.push(profile));
    }

    const filtredProfiles = filterProfiles.slice((page - 1) * limit, page * limit);

    return { profiles: filtredProfiles, amount: filterProfiles.length };
  }

  public async create(profileData: IProfileDTO): Promise<Profile> {
    const profile: Profile = new Profile();

    Object.assign(profile, { id: uuid() }, profileData);
    this.profiles.push(profile);

    return profile;
  }

  public async update(profileData: Profile): Promise<Profile> {
    const findProfile: number = this.profiles.findIndex(
      profile => profile.id === profileData.id,
    );

    this.profiles[findProfile] = profileData;

    return profileData;
  }

  public async delete(profileData: Profile | IObjectDTO): Promise<void> {
    if (profileData instanceof Profile) {
      const findProfile: number = this.profiles.findIndex(
        profile => profile.id === profileData.id,
      );

      this.profiles.splice(findProfile, 1);
    } else {
      Object.keys(profileData).forEach((key: string) => {
        const findProfile: Profile[] = this.profiles.filter(
          (profile: any) => profile[key] === profileData[key],
        );

        findProfile.forEach(eachProfile => {
          const profileIndex: number = this.profiles.findIndex(
            profile => profile.id === eachProfile.id,
          );

          this.profiles.splice(profileIndex, 1);
        });
      });
    }
  }

  public async softDelete(profileData: Profile | IObjectDTO): Promise<void> {
    if (profileData instanceof Profile) {
      const findProfile: number = this.profiles.findIndex(
        (profile: any) => profile.id === profileData.id,
      );

      this.profiles[findProfile].deleted_at = new Date();
    } else {
      Object.keys(profileData).forEach((key: string) => {
        const findProfile: Profile[] = this.profiles.filter(
          (profile: any) => profile[key] === profileData[key],
        );

        findProfile.forEach(eachProfile => {
          const profileIndex: number = this.profiles.findIndex(
            profile => profile.id === eachProfile.id,
          );

          this.profiles[profileIndex].deleted_at = new Date();
        });
      });
    }
  }
}

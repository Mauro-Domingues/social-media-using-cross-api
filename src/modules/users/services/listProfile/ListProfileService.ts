import { injectable, inject } from 'tsyringe';

import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Profile from '@modules/users/entities/Profile';
import ICacheDTO from '@dtos/ICacheDTO';
import IListDTO from '@dtos/IListDTO';
import { instanceToInstance } from 'class-transformer';

@injectable()
export default class ListProfileService {
  constructor(
    @inject('ProfilesRepository')
    private profilesRepository: IProfilesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(page: number, limit: number): Promise<IListDTO<Profile>> {
    const cacheKey = `profiles:${page}:${limit}`;

    let cache = await this.cacheProvider.recovery<ICacheDTO<Profile>>(cacheKey);

    if (!cache) {
      const { profiles, amount } = await this.profilesRepository.findAll(
        page,
        limit,
      );
      cache = {
        data: instanceToInstance(profiles),
        total: amount,
      };
      await this.cacheProvider.save(cacheKey, cache);
    }

    return {
      code: 200,
      message_code: 'OK',
      message: 'Profiles found successfully',
      pagination: {
        total: cache.total,
        page,
        perPage: limit,
        lastPage: cache.total % limit,
      },
      data: cache.data,
    };
  }
}

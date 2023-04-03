import AppError from '@shared/errors/AppError';

interface IExtraMethodDTO {
  findLike<T>(
    entityData: Partial<T>,
    select?: { [key: string]: boolean },
    order?: { [key: string]: 'asc' | 'desc' },
    limit?: number,
  ): Promise<T[]>;
}

/**
 * @param { IEntityRepository } IEntityRepository new Slugify(this.somethingRepository) inside the constructor of your class
 */
export class Slugify<IEntityRepository> {
  private repository: IEntityRepository extends IExtraMethodDTO
    ? IExtraMethodDTO
    : IEntityRepository;

  constructor(
    repository: IEntityRepository extends IExtraMethodDTO
      ? IExtraMethodDTO
      : IEntityRepository,
  ) {
    this.repository = repository;
  }

  private isExtraMethod(
    _repository: IExtraMethodDTO | IEntityRepository,
  ): _repository is IExtraMethodDTO {
    return true;
  }

  /**
   * @param {string} name Send the name / title of the entity
   * @return {string} slug
   *
   * @example
   * // If Error('This method was not implemented in the source repository') --> insert this method on your EntityRepository.ts
   * public async findLike(
   *   entityData: Partial<Entity>,
   *   select?: { [key: string]: boolean },
   *   order?: { [key: string]: 'asc' | 'desc' },
   *   limit?: number,
   * ): Promise<Entity[]> {
   *   const entities = await this.ormRepository.find({
   *     select,
   *     where: { [Object.keys(entityData)[0]]: Like(Object.values(entityData)[0]) },
   *     order,
   *     take: limit,
   *   });
   *
   *   return entities;
   * }
   */
  public async execute(name: string): Promise<string> {
    let slug: string;
    slug = name
      .toLowerCase()
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036f]/g, '')
      .replaceAll(' ', '-')
      .replaceAll('/', '-');

    if (this.isExtraMethod(this.repository))
      try {
        const checkSlug = await this.repository.findLike(
          {
            slug: `${slug}%`,
          },
          { slug: true },
          { slug: 'desc' },
          1,
        );

        if (checkSlug.length > 0) {
          const foundSlug = checkSlug[0].slug.split('-').at(-1);
          const index = Number(foundSlug);

          if (foundSlug && !Number.isNaN(index)) {
            slug += `-${index + 1}`;
          } else {
            slug += '-1';
          }
        }
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message === 'this.repository.findLike is not a function'
        ) {
          throw new AppError(
            'This method was not implemented in the source repository',
          );
        }
        throw error;
      }

    return slug;
  }
}

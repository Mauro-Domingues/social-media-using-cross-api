import IObjectDTO from "@dtos/IObjectDTO";

/**
 * CLONE VALUES -> Receives as parameter a string array and another object of type { [key: string]: string }, returns an array of objects with the same value, is useful for queries find WHERE + OR.
 * @param attribute IObjectDTO
 * @returns Promise: IObjectDTO[]
 * @param params string[]
 */
export default async function mapAndCloneAttribute(
  attribute: IObjectDTO,
  params: string[],
): Promise<IObjectDTO[]> {
  const objectArray: IObjectDTO[] = [];
  params.forEach((param: string) => {
    objectArray.push({
      [param]: Object.values(attribute)[0],
    });
  });

  return objectArray;
}

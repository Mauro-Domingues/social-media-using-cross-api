import IUserDTO from './IUserDTO';

export default interface IAuthDTO extends IUserDTO {
  refresh_token?: string | string[] | undefined;
}

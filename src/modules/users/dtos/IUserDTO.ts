import Permission from '../entities/Permission';
import Role from '../entities/Role';
import IAddressDTO from './IAddressDTO';
import IProfileDTO from './IProfileDTO';

export default interface IUserDTO extends IProfileDTO {
  email: string;
  password: string;
  profile_id: string;
  address: IAddressDTO;
  permissions: Permission[];
  permissions_id_array: string[];
  role: Role;
  role_id: string;
}

import Role from '../entities/Role';

export default interface IPermissionDTO {
  name: string;
  description: string;
  slug: string;
  roles: Role[];
  roles_id_array: string[];
}

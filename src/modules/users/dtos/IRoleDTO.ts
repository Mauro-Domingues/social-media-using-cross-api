import Permission from '../entities/Permission';

export default interface IRoleDTO {
  name: string;
  description: string;
  slug: string;
  permissions: Permission[];
  permissions_id_array: string[];
}

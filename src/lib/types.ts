import { INavData } from '@coreui/angular';

export interface INavDataWithPermission extends INavData {
  roles?: string[]; // array of roles - user must have at least one of these roles
  permission?: string[]; // array of required permissions - user must have at least one of these permissions
  onlyFor?: string[]; // array of exclusive roles - only show if user has these specific roles (stricter than 'roles')
  children?: INavDataWithPermission[];
}
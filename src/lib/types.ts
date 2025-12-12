import { INavData } from '@coreui/angular';

export interface INavDataWithPermission extends INavData {
  permission?: string[]; // array of required permissions
  children?: INavDataWithPermission[];
}
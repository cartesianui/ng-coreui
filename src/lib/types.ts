import { INavData } from '@coreui/angular';

export interface INavDataWithPermission extends INavData {
  roles?: string[]; // array of roles - user must have at least one of these roles
  permission?: string[]; // array of required permissions - user must have at least one of these permissions
  onlyFor?: string[]; // array of exclusive roles - only show if user has these specific roles (stricter than 'roles')
  children?: INavDataWithPermission[];
}

/**
 * A top-level section (header tab) that scopes the sidebar to one domain
 * (Sales, Purchase, Financial Accounting, …). Opt-in: a host route supplies
 * `data.sections`; when absent the layout renders the flat `data.navItems`
 * exactly as before (so apps that don't use sections are unaffected).
 */
export interface NavSection {
  /** Stable key; also used to mark the active header tab. */
  key: string;
  /** Header tab label. */
  label: string;
  /** Optional CoreUI icon name for the tab. */
  icon?: string;
  /** Route the tab navigates to when clicked (a representative item url). */
  defaultRoute: string;
  /** The sidebar nav shown while this section is active. */
  nav: INavDataWithPermission[];
}
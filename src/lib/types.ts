import { INavData } from '@coreui/angular';

export interface INavDataWithPermission extends INavData {
  roles?: string[]; // array of roles - user must have at least one of these roles
  permission?: string[]; // array of required permissions - user must have at least one of these permissions
  onlyFor?: string[]; // array of exclusive roles - only show if user has these specific roles (stricter than 'roles')
  // array of entitlement keys (Cartesian\Entitlement\EntitlementRegistry) -
  // tenant's plan must include at least one of these. UX-only hiding, not a
  // security boundary — the BE gate is the real enforcement. See
  // EntitlementsService.
  entitlements?: string[];
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
  // Array of entitlement keys - tenant's plan must include at least one of
  // these, or the WHOLE section (header tab + sidebar nav) is hidden, not
  // just individual items. Only safe to set when EVERY item in `nav` is
  // covered by one of these keys (or is intentionally baseline/ungated
  // elsewhere) — omit whenever a section mixes gated content with items
  // that aren't verified against a real entitlement key, since hiding the
  // whole tab would incorrectly hide those too. See EntitlementsService.
  entitlements?: string[];
}
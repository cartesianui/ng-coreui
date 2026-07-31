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
  // Permission gate for the WHOLE section (header tab + sidebar nav) —
  // caller must hold at least one of these (RPH-025,
  // roles-permission-hardening; sections previously had entitlements only,
  // so a tab could not be permission-gated at all). Same any-of semantics
  // and the same "only set when every item in `nav` is covered" caution as
  // `entitlements` above. Tag values should follow ADR-004's any-of
  // listing-verb convention: ['list:x','list:group:x','list:any:x',
  // 'read:any:x','manage:x']. UX-only, not a security boundary — the route
  // guard + BE are the enforcement.
  permission?: string[];
  // Role gate for the WHOLE section — caller must have at least one of
  // these role names. Same semantics/cautions as `permission`. Prefer
  // permission tags (ADR-004); role tags are for genuinely role-shaped
  // sections (e.g. talent's artist/agent surfaces).
  roles?: string[];
}
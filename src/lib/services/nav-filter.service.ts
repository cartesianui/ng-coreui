import { Injectable } from '@angular/core';
import { INavDataWithPermission } from '../types';

@Injectable({
  providedIn: 'root'
})
export class NavFilterService {

  /**
   * Filters navigation items based on user permissions and roles
   * @param items - Navigation items to filter
   * @param grantedPermissions - Array of permissions the user has
   * @param assignedRoles - Array of roles assigned to the user
   * @param debug - Enable debug logging (default: false)
   * @param hasEntitlement - Checks whether the tenant's plan includes a given
   *   entitlement key (default: allow everything — callers that don't pass
   *   this, e.g. existing tests, are unaffected). See `item.entitlements`.
   * @returns Filtered navigation items
   */
  filterNavByPermissionsAndRoles(
    items: INavDataWithPermission[],
    grantedPermissions: string[],
    assignedRoles: string[],
    debug: boolean = false,
    hasEntitlement: (key: string) => boolean = () => true
  ): INavDataWithPermission[] {
    const filtered = items
      .map((item) => {
        // Check if item has permission requirement
        const hasPermission = !item.permission || item.permission.some((p) => grantedPermissions.includes(p));

        // Check if item has role requirement (user must have at least one of these roles)
        const hasRole = !item.roles || item.roles.some((r) => assignedRoles.includes(r));

        // Check if item has 'onlyFor' restriction (stricter - user must have one of these specific roles)
        // If onlyFor is specified, it takes precedence over 'roles'
        const hasOnlyForRole = !item.onlyFor || item.onlyFor.some((r) => assignedRoles.includes(r));

        // Check if the tenant's plan includes at least one required entitlement key
        const hasEntitlementAccess = !item.entitlements || item.entitlements.some((e) => hasEntitlement(e));

        // Item must satisfy permission AND role AND onlyFor AND entitlement requirements (if specified)
        const hasAccess = hasPermission && hasRole && hasOnlyForRole && hasEntitlementAccess;

        // Debug logging for items with restrictions
        if (debug && (item.onlyFor || item.roles || item.permission || item.entitlements)) {
          console.log(`[Nav Filter] Item: "${item.name}" (${item.title ? 'title' : item.divider ? 'divider' : 'item'})`, {
            permission: item.permission,
            roles: item.roles,
            onlyFor: item.onlyFor,
            entitlements: item.entitlements,
            assignedRoles,
            grantedPermissions,
            hasPermission,
            hasRole,
            hasOnlyForRole,
            hasEntitlementAccess,
            hasAccess
          });
        }

        // For dividers without restrictions, always show
        if (item.divider && !item.permission && !item.roles && !item.onlyFor && !item.entitlements) {
          return item;
        }

        // For titles and dividers with restrictions, filter them
        if (item.title || item.divider) {
          return hasAccess ? item : null;
        }

        // Handle children recursively
        if (item.children?.length) {
          if (!hasAccess) {
            return null;
          }

          const filteredChildren = this.filterNavByPermissionsAndRoles(
            item.children,
            grantedPermissions,
            assignedRoles,
            debug,
            hasEntitlement
          );

          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }

          // Every child was filtered out. The old code fell through and
          // returned the ORIGINAL item — unfiltered children and all — so a
          // parent whose children were all permission-denied reappeared with
          // its full child list (known since fe-entitlement-nav, fixed here
          // as RPH-022; reachable once parents AND children carry tags).
          // A childless parent is only worth showing if it is a destination
          // in its own right; a pure grouping node with nothing left in it
          // is dropped.
          return item.url ? { ...item, children: undefined } : null;
        }

        // If no children, return only items user has access to
        return hasAccess ? item : null;
      })
      .filter(Boolean) as INavDataWithPermission[];

    return this.pruneEmptyGroups(filtered);
  }

  /**
   * Drop group headers (`title` / `divider`) that no longer have anything
   * under them.
   *
   * An untagged `title` always passes the filter above — it carries no
   * permission of its own — so gating the ITEMS in a group leaves the heading
   * behind with nothing beneath it. Observed as a doctor seeing bare
   * "Insights" / "General" / "System" headings in the Admin section: the only
   * entry each still had was one that happened to be ungated.
   *
   * Tagging every heading to match its contents is not a fix — it duplicates
   * each group's rules in a second place and silently rots the moment an item
   * is added or its gate changes. Emptiness is derived here instead, so a
   * group disappears exactly when its last visible item does.
   *
   * Headers are buffered and only emitted once a real item follows; a trailing
   * run is dropped, which also removes a separator left dangling at the end.
   *
   * A `title` RESETS the buffer rather than appending to it: reaching a new
   * heading proves the previous one never got any content, so it must be
   * discarded there and then. Merely appending would resurrect it the moment
   * any later group had a visible item — which is exactly what happened in
   * testing, where a doctor kept an empty "General" heading because "Settings"
   * appeared further down under "System".
   */
  private pruneEmptyGroups(items: INavDataWithPermission[]): INavDataWithPermission[] {
    const out: INavDataWithPermission[] = [];
    let pendingHeaders: INavDataWithPermission[] = [];

    for (const item of items) {
      if (item.title) {
        pendingHeaders = [item];
        continue;
      }

      if (item.divider) {
        pendingHeaders.push(item);
        continue;
      }

      if (pendingHeaders.length) {
        out.push(...pendingHeaders);
        pendingHeaders = [];
      }

      out.push(item);
    }

    return out;
  }
}

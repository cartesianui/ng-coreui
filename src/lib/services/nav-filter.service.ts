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
    return items
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
          const filteredChildren = this.filterNavByPermissionsAndRoles(
            item.children,
            grantedPermissions,
            assignedRoles,
            debug,
            hasEntitlement
          );

          // If children exist after filtering, return parent with children
          // But only if parent itself has access
          if (filteredChildren.length > 0 && hasAccess) {
            return { ...item, children: filteredChildren };
          }
        }

        // If no children, return only items user has access to
        return hasAccess ? item : null;
      })
      .filter(Boolean) as INavDataWithPermission[];
  }
}

import { INavDataWithPermission } from '../types';

declare const cartesian: any;

/**
 * Resolves placeholder labels in nav items using tenant branding config.
 * Supports: {{tenant_term}}, {{tenant_plural}}
 */
export function resolveNavLabels(items: INavDataWithPermission[]): INavDataWithPermission[] {
  const tenancyAs = cartesian?.tenancy?.as;
  const replacements: Record<string, string> = {
    '{{tenant_term}}': tenancyAs?.businessTerm || 'Tenant',
    '{{tenant_plural}}': tenancyAs?.businessTermPlural || 'Tenants',
  };

  return items.map(item => {
    const resolved = { ...item };
    if (resolved.name && replacements[resolved.name]) {
      resolved.name = replacements[resolved.name];
    }
    if (resolved.children) {
      resolved.children = resolveNavLabels(resolved.children);
    }
    return resolved;
  });
}

import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermissionCheckerService } from '@cartesianui/core';
import { INavDataWithPermission } from '../types';
import { NavFilterService } from '../services/nav-filter.service';
import { resolveNavLabels } from '../utils/nav-label.util';

/**
 * Sidebar-less shell (POS / Care): the filtered nav is rendered as
 * horizontal links in the header instead of a side rail. We still resolve
 * `data.navItems` here (permission/role filtered + labels), then hand the
 * list to <app-default-header> via its `navItems` input.
 */
@Component({
  selector: 'app-workspace-layout',
  templateUrl: './workspace-layout.component.html',
  standalone: false
})
export class WorkspaceLayoutComponent {
  protected permissonService = inject(PermissionCheckerService);
  private navFilterService = inject(NavFilterService);

  public navItems: INavDataWithPermission[];

  public constructor(private route: ActivatedRoute) {
    const grantedPermissions = this.permissonService.getGrantedPermissions() as unknown as string[];
    const assignedRoles = this.permissonService.getAllAssignedRoles();

    const filtered = this.navFilterService.filterNavByPermissionsAndRoles(
      route.snapshot.data['navItems'],
      grantedPermissions,
      assignedRoles,
      false
    );
    this.navItems = resolveNavLabels(filtered);
  }
}

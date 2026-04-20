import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermissionCheckerService } from '@cartesianui/core';
import { INavData } from '@coreui/angular';
import { INavDataWithPermission } from '../types';
import { NavFilterService } from '../services/nav-filter.service';
import { resolveNavLabels } from '../utils/nav-label.util';

function isOverflown(element: HTMLElement) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  standalone: false
})
export class DefaultLayoutComponent {
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

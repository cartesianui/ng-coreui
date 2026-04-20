import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
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
  templateUrl: './collapsed-layout.component.html',
  standalone: false
})
export class CollapsedLayoutComponent implements AfterViewInit {
  protected permissonService = inject(PermissionCheckerService);
  private navFilterService = inject(NavFilterService);

  public navItems: INavDataWithPermission[];
  @ViewChild('sidebar') sidebar: any;
  //private sidebarNarrowKey = 'sidebar-narrow-state';

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

  ngAfterViewInit(): void {
    // Restore sidebar narrow state from localStorage
    // const savedNarrowState = localStorage.getItem(this.sidebarNarrowKey);
    // if (savedNarrowState === 'true' && this.sidebar) {
    //   setTimeout(() => {
    //     this.sidebar.narrow = true;
    //   }, 100);
    // }
    this.sidebar.narrow = true;
  }

  // Method to be called when sidebar toggle button is clicked
  // onSidebarToggle(): void {
  //   if (this.sidebar) {
  //     setTimeout(() => {
  //       // Save the narrow state to localStorage
  //       localStorage.setItem(this.sidebarNarrowKey, this.sidebar.narrow.toString());
  //     }, 50);
  //   }
  // }
}

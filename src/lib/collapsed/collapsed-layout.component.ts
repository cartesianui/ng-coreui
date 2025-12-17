import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermissionCheckerService } from '@cartesianui/core';
import { INavData } from '@coreui/angular';
import { INavDataWithPermission } from '../types';

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

  public navItems: INavDataWithPermission[];
  @ViewChild('sidebar') sidebar: any;
  //private sidebarNarrowKey = 'sidebar-narrow-state';

  public constructor(private route: ActivatedRoute) {
    const grantedPermissions = this.permissonService.getGrantedPermissions() as unknown as string[];
    this.navItems = this.filterNavByPermissions(route.snapshot.data['navItems'], grantedPermissions);
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

  private filterNavByPermissions(items: INavDataWithPermission[], granted: string[]): INavDataWithPermission[] {
    return items
      .map((item) => {
        // Always keep title and divider
        if (item.title || item.divider) return item;

        // Check if item has permission requirement
        const hasPermission = !item.permission || item.permission.some((p) => granted.includes(p));

        // Handle children recursively
        if (item.children?.length) {
          const filteredChildren = this.filterNavByPermissions(item.children, granted);

          // If children exist after filtering, return parent with children
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
        }

        // If no children, return only items user has permission to view
        return hasPermission ? item : null;
      })
      .filter(Boolean) as INavDataWithPermission[];
  }
}

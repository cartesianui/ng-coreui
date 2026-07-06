import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PermissionCheckerService } from '@cartesianui/core';
import { INavData } from '@coreui/angular';
import { INavDataWithPermission, NavSection } from '../types';
import { NavFilterService } from '../services/nav-filter.service';
import { NavSectionService } from '../services/nav-section.service';
import { resolveNavLabels } from '../utils/nav-label.util';

function isOverflown(element: HTMLElement) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

@Component({
  selector: 'app-console-layout',
  templateUrl: './console-layout.component.html',
  standalone: false
})
export class ConsoleLayoutComponent {
  protected permissonService = inject(PermissionCheckerService);
  private navFilterService = inject(NavFilterService);
  private sectionService = inject(NavSectionService);
  private destroyRef = inject(DestroyRef);

  public navItems: INavDataWithPermission[];

  public constructor(private route: ActivatedRoute, private router: Router) {
    const grantedPermissions = this.permissonService.getGrantedPermissions() as unknown as string[];
    const assignedRoles = this.permissonService.getAllAssignedRoles();

    const filterNav = (items: INavDataWithPermission[]): INavDataWithPermission[] =>
      resolveNavLabels(
        this.navFilterService.filterNavByPermissionsAndRoles(items, grantedPermissions, assignedRoles, false)
      );

    const sections = route.snapshot.data['sections'] as NavSection[] | undefined;

    if (sections?.length) {
      // Section mode (opt-in): the sidebar shows only the active section's
      // nav; the header renders the section tabs. Active section is derived
      // from the URL so deep links / refresh land on the right one.
      const filtered: NavSection[] = sections.map((ws) => ({ ...ws, nav: filterNav(ws.nav) }));
      this.sectionService.setSections(filtered);

      // The all-sections overview lives above every section. On it, NO
      // section tab should look selected (the header's Home button is the
      // active element instead). Configurable via route data, defaults to the
      // path the header's Home button links to.
      const globalDashboardUrl =
        (route.snapshot.data['globalDashboardUrl'] as string | undefined) ?? '/admin/dashboard';

      const apply = (url: string) => {
        const path = (url || '').split('?')[0].split('#')[0];
        const onGlobal = path === globalDashboardUrl || path.startsWith(globalDashboardUrl + '/');
        const resolved = this.sectionService.resolveKeyFromUrl(url);
        const previous = this.sectionService.activeKey();

        // Header tab highlight: cleared on the global overview so no section
        // tab reads as selected; otherwise the resolved section, falling back
        // to the last active one (keeps the tab steady on unmatched sub-pages).
        const activeKey = onGlobal ? null : (resolved ?? previous ?? filtered[0]?.key ?? null);
        this.sectionService.setActiveKey(activeKey);

        // Sidebar still shows a section's nav (resolved, else the last active,
        // else the first) so the global overview isn't left with an empty rail.
        const sidebarKey = activeKey ?? resolved ?? previous ?? filtered[0]?.key ?? null;
        this.navItems = filtered.find((w) => w.key === sidebarKey)?.nav ?? [];
      };

      apply(this.router.url);
      this.router.events
        .pipe(
          filter((e): e is NavigationEnd => e instanceof NavigationEnd),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((e) => apply(e.urlAfterRedirects));
    } else {
      // Flat mode (default) — unchanged behavior for apps without sections.
      this.navItems = filterNav(route.snapshot.data['navItems']);
    }
  }
}

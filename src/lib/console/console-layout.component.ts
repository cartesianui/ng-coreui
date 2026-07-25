import { Component, DestroyRef, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EntitlementsService, PermissionCheckerService } from '@cartesianui/core';
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
  private entitlementsService = inject(EntitlementsService);
  private destroyRef = inject(DestroyRef);

  public navItems: INavDataWithPermission[] = [];

  // Raw (unfiltered) route data, captured once — only the FILTER result
  // needs to re-run when entitlements finish loading (see the `effect`
  // below), not these.
  private readonly sections: NavSection[] | undefined;
  private readonly flatNavItems: INavDataWithPermission[] | undefined;
  private readonly globalDashboardUrl: string;

  public constructor(private route: ActivatedRoute, private router: Router) {
    this.sections = route.snapshot.data['sections'] as NavSection[] | undefined;
    this.flatNavItems = route.snapshot.data['navItems'];
    // The all-sections overview lives above every section. On it, NO
    // section tab should look selected (the header's Home button is the
    // active element instead). Configurable via route data, defaults to the
    // path the header's Home button links to.
    this.globalDashboardUrl = (route.snapshot.data['globalDashboardUrl'] as string | undefined) ?? '/admin/dashboard';

    // Entitlements load asynchronously (one HTTP round-trip after boot,
    // fail-open until then — see EntitlementsService), unlike permissions
    // which are already synchronously available from the blocking
    // AppInitializer bundle. `rebuild()` calls `entitlementsService.has()`
    // synchronously below, so this effect re-runs (and re-filters the
    // CURRENT url) exactly once more when `loaded` flips true — a brief,
    // one-time nav refresh rather than a permanent subscription cost.
    effect(() => this.rebuild(this.router.url));

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((e) => this.rebuild(e.urlAfterRedirects));
  }

  private rebuild(url: string): void {
    const grantedPermissions = this.permissonService.getGrantedPermissions() as unknown as string[];
    const assignedRoles = this.permissonService.getAllAssignedRoles();
    const hasEntitlement = (key: string) => this.entitlementsService.has(key);

    const filterNav = (items: INavDataWithPermission[]): INavDataWithPermission[] =>
      resolveNavLabels(
        this.navFilterService.filterNavByPermissionsAndRoles(items, grantedPermissions, assignedRoles, false, hasEntitlement)
      );

    if (this.sections?.length) {
      // Section mode (opt-in): the sidebar shows only the active section's
      // nav; the header renders the section tabs. Active section is derived
      // from the URL so deep links / refresh land on the right one.
      //
      // A section with `entitlements` set is dropped ENTIRELY (tab + nav)
      // when the tenant has none of the listed keys — distinct from the
      // per-item filtering in `filterNav` below, which only hides items
      // WITHIN a still-visible section. Only sections fully covered by
      // their listed keys get this (see NavSection.entitlements doc) — a
      // section mixing gated and ungated/unverified items never sets it,
      // so this never risks hiding an always-on item along with the tab.
      const visibleSections = this.sections.filter(
        (ws) => !ws.entitlements || ws.entitlements.some((e) => hasEntitlement(e))
      );
      const filtered: NavSection[] = visibleSections.map((ws) => ({ ...ws, nav: filterNav(ws.nav) }));
      this.sectionService.setSections(filtered);

      const path = (url || '').split('?')[0].split('#')[0];
      const onGlobal = path === this.globalDashboardUrl || path.startsWith(this.globalDashboardUrl + '/');
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
    } else {
      // Flat mode (default) — unchanged behavior for apps without sections.
      this.navItems = filterNav(this.flatNavItems ?? []);
    }
  }
}

import { Injectable, computed, signal } from '@angular/core';
import { NavSection, INavDataWithPermission } from '../types';

/**
 * Holds the header-section state for the app shell: the list of sections
 * and which one is active. The layout sets the sections + active key (derived
 * from the URL on each navigation); the header reads them to render the tabs.
 *
 * Section-mode is opt-in — when a host doesn't supply `data.sections` the
 * layout never calls `setSections`, `sections()` stays empty, and the
 * header renders no tabs (flat-sidebar apps are unaffected).
 */
@Injectable({ providedIn: 'root' })
export class NavSectionService {
  readonly sections = signal<NavSection[]>([]);
  readonly activeKey = signal<string | null>(null);

  readonly active = computed<NavSection | null>(
    () => this.sections().find((w) => w.key === this.activeKey()) ?? null
  );

  setSections(sections: NavSection[]): void {
    this.sections.set(sections ?? []);
  }

  setActiveKey(key: string | null): void {
    this.activeKey.set(key);
  }

  /**
   * Resolve the section a URL belongs to by longest-prefix match against
   * each section's nav item urls. Leaf urls are longer than group urls, so a
   * specific page resolves to the right section even when sections share a
   * url branch (e.g. `/admin/catalog/products` → Catalog vs the same product
   * URL referenced elsewhere). Returns null when nothing matches.
   */
  resolveKeyFromUrl(url: string): string | null {
    const path = (url || '').split('?')[0].split('#')[0];
    let bestKey: string | null = null;
    let bestLen = -1;

    for (const ws of this.sections()) {
      for (const itemUrl of this.collectUrls(ws.nav)) {
        if (!itemUrl) continue;
        const matches = path === itemUrl || path.startsWith(itemUrl + '/');
        if (matches && itemUrl.length > bestLen) {
          bestKey = ws.key;
          bestLen = itemUrl.length;
        }
      }
    }
    return bestKey;
  }

  /** Flatten a nav tree to the set of item urls (recurses children). */
  private collectUrls(nav: INavDataWithPermission[] | undefined): string[] {
    const out: string[] = [];
    for (const item of nav ?? []) {
      if (typeof item.url === 'string' && item.url.length) out.push(item.url);
      if (item.children?.length) out.push(...this.collectUrls(item.children));
    }
    return out;
  }
}

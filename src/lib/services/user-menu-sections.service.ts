import { Injectable, signal } from '@angular/core';

/** One actionable row contributed to the user-menu dropdown. */
export interface UserMenuItem {
  /** Stable id (unique within its section). */
  id: string;
  label: string;
  /** Font Awesome class (e.g. 'fa fa-store'). */
  icon?: string;
  /** Highlighted as the current selection. */
  active?: boolean;
  handler: () => void;
}

/** A titled group of items contributed to the user-menu dropdown. */
export interface UserMenuSection {
  /** Stable id — used to upsert / remove the same section. */
  id: string;
  /** Section heading (omit for an untitled group). */
  title?: string;
  items: UserMenuItem[];
}

/**
 * Decouples user-menu dropdown groups from the shared shell: a feature
 * (e.g. shopifier's store switcher) registers a section here and the menu
 * renders it generically. This keeps the platform shell free of any
 * feature/domain knowledge — the same inversion as `HeaderActionsService`
 * (header buttons) and `HTTP_HEADER_CONTRIBUTORS` (request headers).
 */
@Injectable({ providedIn: 'root' })
export class UserMenuSectionsService {
  readonly sections = signal<UserMenuSection[]>([]);

  /** Add or replace a section (matched by `id`). Safe to call from an effect. */
  set(section: UserMenuSection): void {
    this.sections.update((list) => [...list.filter((s) => s.id !== section.id), section]);
  }

  /** Remove a section by id — safe no-op if it isn't registered. */
  remove(id: string): void {
    this.sections.update((list) => list.filter((s) => s.id !== id));
  }

  clear(): void {
    this.sections.set([]);
  }
}

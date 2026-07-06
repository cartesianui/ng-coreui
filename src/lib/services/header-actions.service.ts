import { Injectable, signal } from '@angular/core';

/**
 * A single action button contributed to the app header's right side by a
 * feature screen. The header renders these blindly — it knows nothing about
 * what they do or the state behind them; the contributing component owns the
 * `handler`, `disabled` and visibility (by adding/removing the action).
 */
export interface HeaderAction {
  /** Stable id — used to upsert / remove the same action. */
  id: string;
  label: string;
  /** Font Awesome class (e.g. 'fa-solid fa-right-from-bracket'). */
  icon?: string;
  /** Bootstrap button variant suffix, e.g. 'outline-secondary' | 'outline-danger'. */
  variant?: string;
  disabled?: boolean;
  /** Native title/tooltip. */
  title?: string;
  /** Always-visible small helper text shown beside the button — use for a
   *  prerequisite hint (disabled buttons don't surface their `title`). */
  note?: string;
  handler: () => void;
}

/**
 * Decouples header-level actions from the shared layout: feature screens
 * (which hold the relevant state — e.g. POS/Care shift + drawer status)
 * register an action here; the header just renders `actions()`. This keeps
 * the platform header free of any feature/domain knowledge.
 *
 * Typical use from a screen:
 *   effect((onCleanup) => {
 *     if (this.selectedShift()) {
 *       this.headerActions.set({ id:'care.end-shift', label:'Done for Today', handler: () => this.onEndShift() });
 *     } else {
 *       this.headerActions.remove('care.end-shift');
 *     }
 *     onCleanup(() => this.headerActions.remove('care.end-shift'));
 *   });
 */
@Injectable({ providedIn: 'root' })
export class HeaderActionsService {
  readonly actions = signal<HeaderAction[]>([]);

  /** Add or replace an action (matched by `id`).
   *  Uses `update()` (not a tracked `actions()` read) so it's safe to call
   *  from inside an `effect()` — reading the signal there would make the
   *  effect depend on what it writes and loop forever. */
  set(action: HeaderAction): void {
    this.actions.update((list) => [...list.filter((a) => a.id !== action.id), action]);
  }

  /** Remove an action by id — safe no-op if it isn't registered. */
  remove(id: string): void {
    this.actions.update((list) => list.filter((a) => a.id !== id));
  }

  clear(): void {
    this.actions.set([]);
  }
}

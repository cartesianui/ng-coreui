import { Component, computed, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent, ColorModeService } from '@coreui/angular';
import { NavSectionService } from '../../services/nav-section.service';
import { HeaderActionsService } from '../../services/header-actions.service';
import { NavSection, INavDataWithPermission } from '../../types';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
  standalone: false
})
export class DefaultHeaderComponent extends HeaderComponent {
  readonly #sectionService = inject(NavSectionService);
  readonly #headerActions = inject(HeaderActionsService);
  readonly #router = inject(Router);
  readonly #colorModeService = inject(ColorModeService);

  // ─── Light / dark theme switcher ───────────────────────────────────────
  readonly colorMode = this.#colorModeService.colorMode;
  readonly isDark = computed(() => this.colorMode() === 'dark');

  constructor() {
    super();
    // Persist the chosen mode across reloads (writes data-coreui-theme on <html>).
    this.#colorModeService.localStorageItemName.set('cui-color-mode');
  }

  toggleTheme(): void {
    this.#colorModeService.colorMode.set(this.isDark() ? 'light' : 'dark');
  }

  /** Feature-contributed header buttons (e.g. POS/Care "Done for Today").
   *  The header renders these without knowing what they do. */
  readonly headerActions = this.#headerActions.actions;

  /** Header section tabs (empty for apps not using section mode). */
  readonly sections = this.#sectionService.sections;
  readonly activeSectionKey = this.#sectionService.activeKey;

  /**
   * Flat header-nav mode — when a host layout passes its `navItems` here,
   * the header renders them as horizontal links (used by the sidebar-less
   * POS / Care shells). Title/divider entries are skipped at render time.
   * Left empty by sidebar apps (admin), which keep their side nav.
   */
  @Input() navItems: INavDataWithPermission[] = [];

  /** Renderable header links — drops the section titles + dividers. */
  get headerNavLinks(): INavDataWithPermission[] {
    return (this.navItems ?? []).filter((i) => !i.title && !i.divider && !!i.url);
  }

  /** Switch section — navigate to its default route; the layout's
   *  router subscription then swaps the sidebar + marks the active tab. */
  switchSection(ws: NavSection): void {
    if (ws?.defaultRoute) {
      this.#router.navigateByUrl(ws.defaultRoute);
    }
  }

  // The user menu (avatar / profile / store switcher / logout) now lives in a
  // shared <app-user-menu> — in the header for topnav apps, in the sidebar
  // footer for console apps. All that logic moved to UserMenuComponent.

  @Input() sidebarId: string = 'sidebar';

  public newMessages = [
    {
      id: 0,
      from: 'Jessica Williams',
      avatar: '7.jpg',
      status: 'success',
      title: 'Urgent: System Maintenance Tonight',
      time: 'Just now',
      link: 'apps/email/inbox/message',
      message: 'Attention team, we\'ll be conducting critical system maintenance tonight from 10 PM to 2 AM. Plan accordingly...'
    },
    {
      id: 1,
      from: 'Richard Johnson',
      avatar: '6.jpg',
      status: 'warning',
      title: 'Project Update: Milestone Achieved',
      time: '5 minutes ago',
      link: 'apps/email/inbox/message',
      message: 'Kudos on hitting sales targets last quarter! Let\'s keep the momentum. New goals, new victories ahead...'
    },
    {
      id: 2,
      from: 'Angela Rodriguez',
      avatar: '5.jpg',
      status: 'danger',
      title: 'Social Media Campaign Launch',
      time: '1:52 PM',
      link: 'apps/email/inbox/message',
      message: 'Exciting news! Our new social media campaign goes live tomorrow. Brace yourselves for engagement...'
    },
    {
      id: 3,
      from: 'Jane Lewis',
      avatar: '4.jpg',
      status: 'info',
      title: 'Inventory Checkpoint',
      time: '4:03 AM',
      link: 'apps/email/inbox/message',
      message: 'Team, it\'s time for our monthly inventory check. Accurate counts ensure smooth operations. Let\'s nail it...'
    },
    {
      id: 4,
      from: 'Ryan Miller',
      avatar: '3.jpg',
      status: 'info',
      title: 'Customer Feedback Results',
      time: '3 days ago',
      link: 'apps/email/inbox/message',
      message: 'Our latest customer feedback is in. Let\'s analyze and discuss improvements for an even better service...'
    }
  ];

  public newNotifications = [
    { id: 0, title: 'New user registered', icon: 'cilUserFollow', color: 'success' },
    { id: 1, title: 'User deleted', icon: 'cilUserUnfollow', color: 'danger' },
    { id: 2, title: 'Sales report is ready', icon: 'cilChartPie', color: 'info' },
    { id: 3, title: 'New client', icon: 'cilBasket', color: 'primary' },
    { id: 4, title: 'Server overloaded', icon: 'cilSpeedometer', color: 'warning' }
  ];

  public newStatus = [
    { id: 0, title: 'CPU Usage', value: 25, color: 'info', details: '348 Processes. 1/4 Cores.' },
    { id: 1, title: 'Memory Usage', value: 70, color: 'warning', details: '11444GB/16384MB' },
    { id: 2, title: 'SSD 1 Usage', value: 90, color: 'danger', details: '243GB/256GB' }
  ];

  public newTasks = [
    { id: 0, title: 'Upgrade NPM', value: 0, color: 'info' },
    { id: 1, title: 'ReactJS Version', value: 25, color: 'danger' },
    { id: 2, title: 'VueJS Version', value: 50, color: 'warning' },
    { id: 3, title: 'Add new layouts', value: 75, color: 'info' },
    { id: 4, title: 'Angular Version', value: 100, color: 'success' }
  ];
}

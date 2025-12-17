import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
;

import { CommonModule as CartesianCommonModule } from '@cartesianui/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  DropdownModule,
  FooterModule,
  GridModule,
  HeaderModule,
  NavModule,
  ProgressModule,
  SharedModule as CoreUiAngularSharedModule,
  SidebarModule,
  UtilitiesModule,
  OffcanvasModule,
  // Standalone CoreUI components/directives
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,

  OffcanvasComponent as COffcanvasComponent,
  OffcanvasBodyComponent,
  OffcanvasHeaderComponent,
  OffcanvasTitleDirective,
  OffcanvasToggleDirective,
  ButtonCloseDirective,

  BreadcrumbComponent,
  BreadcrumbItemComponent,
  //BreadcrumbRouterService
} from '@coreui/angular';

import { IconModule, IconSetService, IconDirective } from '@coreui/icons-angular';

// Import 3rd party modules
import { NgScrollbarModule } from 'ngx-scrollbar';

import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
  DefaultPageTitleComponent,
  OffcanvasComponent
} from './default';

import {
  CollapsedFooterComponent,
  CollapsedHeaderComponent,
  CollapsedPageTitleComponent,
  CollapsedLayoutComponent
} from './collapsed';

const APP_CONTAINERS = [
  OffcanvasComponent,
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultPageTitleComponent,
  DefaultLayoutComponent,
  CollapsedFooterComponent,
  CollapsedHeaderComponent,
  CollapsedPageTitleComponent,
  CollapsedLayoutComponent,
];

@NgModule({
  imports: [
    // Angular core
    CommonModule,
    NgTemplateOutlet,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CartesianCommonModule,

    // 3rd party
    NgScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),

    // CoreUI NgModules
    IconModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    NavModule,
    ButtonModule,
    ProgressModule,
    BadgeModule,
    UtilitiesModule,
    CoreUiAngularSharedModule,
    OffcanvasModule,

    // Standalone CoreUI components/directives
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    IconDirective,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ShadowOnScrollDirective,
    AvatarComponent,
    BadgeComponent,
    BreadcrumbRouterComponent,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    HeaderComponent,
    HeaderNavComponent,
    HeaderTogglerDirective,
    NavItemComponent,
    NavLinkDirective,

    // CoreUI Offcanvas standalone components
    COffcanvasComponent,
    OffcanvasBodyComponent,
    OffcanvasHeaderComponent,
    OffcanvasTitleDirective,
    OffcanvasToggleDirective,
    ButtonCloseDirective,

    BreadcrumbComponent,
    BreadcrumbItemComponent
  ],
  declarations: [...APP_CONTAINERS],
  providers: [
    IconSetService
  ],
  exports: [
    DefaultPageTitleComponent,
    OffcanvasComponent,
    //BreadcrumbRouterService
  ]
})
export class BoLayoutModule {
  static forRoot(): ModuleWithProviders<BoLayoutModule> {
    return {
      ngModule: BoLayoutModule,
      providers: []
    };
  }

  static forFeature(): ModuleWithProviders<BoLayoutModule> {
    return {
      ngModule: BoLayoutModule,
      providers: []
    };
  }
}

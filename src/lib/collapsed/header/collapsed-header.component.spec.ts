import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarModule, BadgeModule, BreadcrumbModule, DropdownModule, GridModule, HeaderModule, NavModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../../icon-subset';
import { CollapsedHeaderComponent } from './collapsed-header.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('DefaultHeaderComponent', () => {
  let component: CollapsedHeaderComponent;
  let fixture: ComponentFixture<CollapsedHeaderComponent>;
  let iconSetService: IconSetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollapsedHeaderComponent],
      imports: [GridModule, HeaderModule, NavModule, BadgeModule, AvatarModule, DropdownModule, BreadcrumbModule, RouterTestingModule, SidebarModule],
      providers: [IconSetService]
    }).compileComponents();
  });

  beforeEach(() => {
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = { ...iconSubset };

    fixture = TestBed.createComponent(CollapsedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

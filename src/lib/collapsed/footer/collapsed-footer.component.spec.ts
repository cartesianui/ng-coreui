import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsedFooterComponent } from './collapsed-footer.component';

describe('DefaultFooterComponent', () => {
  let component: CollapsedFooterComponent;
  let fixture: ComponentFixture<CollapsedFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollapsedFooterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsedFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

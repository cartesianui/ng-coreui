import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INavData } from '@coreui/angular';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  standalone: false
})
export class DefaultLayoutComponent {
  public navItems: INavData[];

  public constructor(private route: ActivatedRoute) {
    this.navItems = route.snapshot.data['navItems'];
  }
}

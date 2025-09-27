import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INavData } from '@coreui/angular';

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

import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

@Component({
  selector: 'app-collapsed-footer',
  templateUrl: './collapsed-footer.component.html',
  styleUrls: ['./collapsed-footer.component.scss'],
  standalone: false
})
export class CollapsedFooterComponent extends FooterComponent {
  constructor() {
    super();
  }
}

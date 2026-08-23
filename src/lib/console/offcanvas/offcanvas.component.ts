import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-offcanvas',
  templateUrl: './offcanvas.component.html',
  standalone: false,
  styles: [
    `
      /* ensure the offcanvas takes full viewport height and body doesn't scroll */
      .offcanvas {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        z-index: 1050;
      }

      /* keep header fixed, let body scroll internally */
      .offcanvas-header {
        flex-shrink: 0;
      }
      .offcanvas-body {
        overflow-y: auto;
        flex: 1 1 auto;
        min-height: 0; /* required for flex child scroll in many browsers */
      }
    `
  ]
})
export class OffcanvasComponent {
  @Input() id: string;
  @Input() title: string;
  @Input() subTitle: string;
  @Input() visible: boolean = false;

  /**
   * Optional override for the drawer's width, e.g. `min(900px, 95vw)`.
   *
   * Omitted, CoreUI's own `.offcanvas-end` width applies — so every existing
   * caller is unaffected. Set it when the panel hosts something that genuinely
   * needs the room, such as a side-by-side layout that would otherwise be
   * squeezed into a single narrow column.
   */
  @Input() width?: string;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  public constructor() {}

  // setVisible = (visible: boolean) => {
  //   this.visible = visible;
  // }

  // visibilityChanged = (visible: boolean) => {
  //   this.visibleChange.emit(visible);
  // }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-offcanvas',
    templateUrl: './offcanvas.component.html',
    standalone: false
})
export class OffcanvasComponent {

  @Input() id: string;  
  @Input() title: string;  
  @Input() subTitle: string;
  @Input() visible: boolean = false; 
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  public constructor() {}

  // setVisible = (visible: boolean) => {
  //   this.visible = visible;
  // }

  // visibilityChanged = (visible: boolean) => {
  //   this.visibleChange.emit(visible);
  // }
}

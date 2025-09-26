import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'default-page-title, page-title',
  styleUrls: ['./default-page-title.component.scss'],
  templateUrl: './default-page-title.component.html'
})
export class DefaultPageTitleComponent implements OnChanges {
  _title: string = '<no title set>';
  @Input()
  set title(title: string) {
    this._title = (title && title.trim()) || '<no title set>';
  }

  _icon?: string = 'fa-file';
  @Input()
  set icon(icon: string) {
    this._icon = (icon && icon.trim()) || 'fa-file';
  }

  _breadcrumb: boolean = true;
  @Input()
  set breadcrumb(breadcrumb: boolean) {
    this._breadcrumb =  true;
  }
  constructor() {}

  ngOnChanges(changes: {[title: string]: SimpleChange}) {
    // console.log(changes);
  }
}

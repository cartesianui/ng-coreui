import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
    selector: 'collapsed-page-title, page-title',
    styleUrls: ['./collapsed-page-title.component.scss'],
    templateUrl: './collapsed-page-title.component.html',
    standalone: false
})
export class CollapsedPageTitleComponent implements OnChanges {
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

import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalog-filter-section',
  templateUrl: 'catalog-filter-section.component.html',
  styleUrls: ['./catalog-filter-section.component.scss']
})

export class CatalogFilterSectionComponent implements OnInit {
  @Input() label;
  @Input() isShowed;
  @HostBinding('class.disabled')
  @Input() disabled;

  ngOnInit() {
    this.isShowed = this.disabled !== undefined ? !this.disabled : true;
  }
}

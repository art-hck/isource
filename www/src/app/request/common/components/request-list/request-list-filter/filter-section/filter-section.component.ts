import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-list-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss']
})
export class FilterSectionComponent implements OnInit {

  @Input() label;
  @Input() isShowed;

  @HostBinding('class.disabled')
  @Input() disabled;

  constructor() { }

  ngOnInit() {
    this.isShowed = this.disabled !== undefined ? !this.disabled : true;
  }

}

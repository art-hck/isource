import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-list-filter-section',
  templateUrl: './request-list-filter-section.component.html',
  styleUrls: ['./request-list-filter-section.component.scss']
})
export class RequestListFilterSectionComponent implements OnInit {

  @Input() label;
  @Input() isShowed;

  @HostBinding('class.disabled')
  @Input() disabled;

  constructor() { }

  ngOnInit() {
    this.isShowed = this.disabled !== undefined ? !this.disabled : true;
  }

}

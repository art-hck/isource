import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-tp-filter-section',
  templateUrl: './request-tp-filter-section.component.html',
  styleUrls: ['./request-tp-filter-section.component.scss']
})
export class RequestTpFilterSectionComponent implements OnInit {

  @Input() label;
  @Input() isShowed;

  @HostBinding('class.disabled')
  @Input() disabled;

  constructor() { }

  ngOnInit() {
    this.isShowed = this.disabled !== undefined ? !this.disabled : true;
  }

}

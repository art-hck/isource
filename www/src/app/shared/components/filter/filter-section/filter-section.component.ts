import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss']
})
export class FilterSectionComponent implements OnInit {
  @HostBinding('class.disabled')
  @Input() disabled: boolean;
  @Input() label: string;
  showed: boolean;

  ngOnInit() {
    this.showed = this.disabled !== undefined ? !this.disabled : true;
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-catalog-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements OnInit {

  @Input() search: string;
  @Output() searchChange = new EventEmitter<string>();

  constructor(
    protected router: Router
  ) {
  }

  ngOnInit() {
  }

  onSearch() {
    this.searchChange.emit(this.search);
  }

  onResetClick() {
    this.search = '';
    this.searchChange.emit(this.search);
  }

  createRequest(): void {
    this.router.navigateByUrl(`requests/create`);
  }
}

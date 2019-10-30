import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-catalog-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
})
export class SearchPanelComponent implements OnInit {

  @Input() searchText: string;
  @Output() searchTextChange = new EventEmitter<string>();

  categoriesOpened = false;

  constructor(
    protected router: Router
  ) {
  }

  ngOnInit() {
  }

  onSearch() {
    this.searchTextChange.emit(this.searchText);
  }

  onResetClick() {
    this.searchText = '';
    this.searchTextChange.emit(this.searchText);
  }

  onToggleCategories() {
    this.categoriesOpened = !this.categoriesOpened;
  }
}

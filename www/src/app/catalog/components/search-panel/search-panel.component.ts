import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'app-catalog-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
})
export class SearchPanelComponent {

  searchText: string;
  //@Output() searchTextChange = new EventEmitter<string>();

  categoriesOpened = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected router: Router
  ) {
  }

  onSearch() {
    //this.searchTextChange.emit(this.searchText);
  }

  onResetClick() {
    this.searchText = '';
    //this.searchTextChange.emit(this.searchText);
  }

  onResize() {
    this.getSearchBarWidth();
  }

  onToggleCategories() {
    this.categoriesOpened = !this.categoriesOpened;
  }

  getSearchBarWidth() {
    return this.document.getElementsByClassName('content-area')[0].clientWidth + 'px';
  }
}

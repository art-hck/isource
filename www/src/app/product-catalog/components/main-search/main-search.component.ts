import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.css']
})
export class MainSearchComponent implements OnInit {

  searchStr: string;

  @Output() searchClick = new EventEmitter();
  @Output() categoriesClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSearch() {
    this.searchClick.emit(this.searchStr);
  }

  onCategoriesClick() {
    this.categoriesClick.emit();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-catalog-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateY(10px)', opacity: 0}),
          animate('100ms', style({transform: 'translateY(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateY(0)', opacity: 1}),
          animate('100ms', style({transform: 'translateY(10px)', opacity: 0}))
        ])
      ]
    )
  ],
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

  createRequest(): void {
    this.router.navigateByUrl(`requests/create`);
  }

  onToggleCategories() {
    this.categoriesOpened = !this.categoriesOpened;
  }
}

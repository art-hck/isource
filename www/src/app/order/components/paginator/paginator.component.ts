import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Input} from "@angular/core";

@Component({
  selector: 'app-orders-pagination',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

  @Input() page = 1;
  @Input() pageSize = 25;
  @Input() totalCount = 0;

  @Output() changePage = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }

  get pagesCount(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  setCurrentPage(pageNumber: number) {
    this.page = pageNumber;
    this.changePage.emit(pageNumber);
  }

  showNextPage() {
    this.setCurrentPage(this.page + 1);
  }

  showPrevPage() {
    this.setCurrentPage(this.page - 1);
  }

  get middlePages() {
    const middlePages: number[] = [];
    if (this.page > 1) {
      middlePages.push(this.page - 1);
    }
    middlePages.push(this.page);
    if (this.page < this.pagesCount) {
      middlePages.push(this.page + 1);
    }
    return middlePages;
  }
}

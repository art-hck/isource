import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnDestroy {
  @Input() total;
  @Input() pageSize;
  @Input() pages$: Observable<number>;
  @Input() siblingCount = 3;
  @Output() change = new EventEmitter<number>();
  current: number;
  private subscription = new Subscription();

  ngOnInit() {
    this.subscription
      .add(this.pages$.subscribe(page => this.change.emit(this.current = page || 1)));
  }

  get leftSiblingCount() {
    return this.current - 1;
  }

  get rightSiblingCount() {
    return this.fullPages.length - this.current;
  }

  get fullPages() {
    return (new Array(Math.ceil(this.total / this.pageSize))).fill(null).map((v, i) => i + 1);
  }

  get pages(): number[] {
    return this.fullPages
      .filter(page => page >= this.current - Math.min(this.leftSiblingCount, this.siblingCount))
      .filter(page => page <= this.current + Math.min(this.rightSiblingCount, this.siblingCount));
  }

  get firstItem() {
    return (this.current - 1) * this.pageSize + 1;
  }

  get lastItem() {
    return Math.min((this.current - 1) * this.pageSize + this.pageSize, this.total);
  }

  get startIndex() {
    return (this.current - 1) * this.pageSize + 1;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

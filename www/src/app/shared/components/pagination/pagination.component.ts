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
  @Output() change = new EventEmitter<number>();
  current: number;
  private subscription = new Subscription();

  ngOnInit() {
    this.subscription
      .add(this.pages$.subscribe(page => this.change.emit(this.current = page || 1)));
  }

  get pages(): number[] {
    let pages = (new Array(Math.ceil(this.total / this.pageSize))).fill(null).map((v, i) => i + 1);
    pages = pages.filter(page => page >= this.current - 3 && page <= this.current + 3);
    return pages;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() total;
  @Input() pageSize;
  @Input() pages$: Observable<number>;
  @Input() siblingCount = 3;
  @Output() change = new EventEmitter<number>();
  current = 1;
  fullPages: number[];
  pages: number[];
  firstItem: number;
  lastItem: number;
  readonly destroy$ = new Subject();

  ngOnChanges() {
    if (this.total && this.pageSize) {
      this.pages$.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.fullPages = this.total && (new Array(Math.ceil(this.total / this.pageSize))).fill(null).map((v, i) => i + 1) || [];
        const leftSiblingCount = Math.min(this.current - 1, this.siblingCount);
        const rightSiblingCount = Math.min(this.fullPages.length - this.current, this.siblingCount);
        this.pages = this.fullPages
          .filter(page => page >= this.current - leftSiblingCount + rightSiblingCount - this.siblingCount)
          .filter(page => page <= this.current - leftSiblingCount + rightSiblingCount + this.siblingCount);
        this.firstItem = (this.current - 1) * this.pageSize + 1;
        this.lastItem = Math.min((this.current - 1) * this.pageSize + this.pageSize, this.total);
      });
    }
  }

  ngOnInit() {
    this.pages$.pipe(takeUntil(this.destroy$)).subscribe(page => this.change.emit(this.current = page || 1));

    this.ngOnChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

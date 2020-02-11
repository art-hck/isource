import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AgreementsService } from "../../../agreements/services/agreements.service";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  @Input() total;
  @Input() pageSize;
  @Input() paramName = "page";
  @Output() change = new EventEmitter<number>();
  current: number;

  constructor(private agreementsService: AgreementsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(map(params => +params[this.paramName] || 1))
      .subscribe(current => this.change.emit(this.current = current)
    );
  }

  pages(total: number): number[] {
    let pages = (new Array(Math.ceil(total / this.pageSize))).fill(null).map((v, i) => i + 1);
    pages = pages.filter(page => page >= this.current - 3 && page <= this.current + 3);
    return pages;
  }
}

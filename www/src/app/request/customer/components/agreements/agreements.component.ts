import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from "rxjs";
import { AgreementsResponse } from "../../../../agreements/models/agreements-response";
import { AgreementsService } from "../../../../agreements/services/agreements.service";
import { finalize, map, publishReplay, refCount } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";

@Component({
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent implements OnInit, OnDestroy {
  agreements$: Observable<AgreementsResponse>;
  total$: Observable<number>;
  pageSize = 20;
  isLoading = false;
  subscription = new Subscription();
  pages$: Observable<number>;

  constructor(private agreementsService: AgreementsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.pages$ = this.route.queryParams.pipe(map(params => +params["page"]));
  }

  getAgreements(page: number) {
    this.isLoading = true;
    return this.agreementsService.getAgreements((page - 1) * this.pageSize, this.pageSize).pipe(
      publishReplay(1), refCount(),
      finalize(() => this.isLoading = false)
    );
  }

  loadPage(page: number) {
    if (!this.agreements$) {
      this.agreements$ = this.getAgreements(page);
    } else {
      this.subscription.add(
        this.getAgreements(page).subscribe(data => this.agreements$ = of(data))
      );
    }

    if (!this.total$) {
      this.total$ = this.agreements$.pipe(map(data => data.totalCount));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

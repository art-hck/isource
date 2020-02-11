import { Component, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from "rxjs";
import { Agreements } from "../../../../dashboard/models/Agreements";
import { AgreementsService } from "../../../../agreements/services/agreements.service";
import { finalize, map, publishReplay, refCount } from "rxjs/operators";

@Component({
  selector: 'app-request-agreements',
  templateUrl: './request-agreements.component.html',
  styleUrls: ['./request-agreements.component.scss']
})
export class RequestAgreementsComponent implements OnDestroy {
  agreements$: Observable<Agreements>;
  total$: Observable<number>;
  pageSize = 20;
  isLoading = false;
  subscription = new Subscription();

  constructor(private agreementsService: AgreementsService) {}

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

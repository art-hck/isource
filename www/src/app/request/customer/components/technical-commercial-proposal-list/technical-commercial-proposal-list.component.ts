import { ActivatedRoute } from "@angular/router";
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { tap } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { StateStatus } from "../../../common/models/state-status";
import { TechnicalCommercialProposalGroupByPosition } from "../../../common/models/technical-commercial-proposal-group-by-position";
import { FormBuilder } from "@angular/forms";
import { TechnicalCommercialProposalComponent } from "../technical-commercial-proposal/technical-commercial-proposal.component";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { getCurrencySymbol } from "@angular/common";

@Component({
  templateUrl: './technical-commercial-proposal-list.component.html',
  styleUrls: ['technical-commercial-proposal-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('proposalsOnReview') proposalsOnReview: QueryList<TechnicalCommercialProposalComponent>;
  @ViewChild('footer', { static: false }) footer: ElementRef;
  requestId: Uuid;
  request$: Observable<Request>;
  @Select(TechnicalCommercialProposalState.getSentToReview)
  readonly proposalsSentToReview$: Observable<TechnicalCommercialProposalGroupByPosition[]>;
  @Select(TechnicalCommercialProposalState.getReviewed)
  readonly proposalsReviewed$: Observable<TechnicalCommercialProposalGroupByPosition[]>;
  @Select(TechnicalCommercialProposalState.status)
  readonly stateStatus$: Observable<StateStatus>;
  readonly chooseBy$ = new Subject<"date" | "price">();
  readonly getCurrencySymbol = getCurrencySymbol;

  get total() {
    return this.proposalsOnReview && this.proposalsOnReview.reduce((total, curr) => {
      const proposalPosition: TechnicalCommercialProposalPosition = curr.selectedProposalPosition.value;
      total += proposalPosition && proposalPosition.priceWithoutVat * proposalPosition.quantity;
      return total;
    }, 0);
  }

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private fb: FormBuilder,
    private requestService: RequestService,
    private store: Store,
  ) {
    this.requestId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.request$ = this.requestService.getRequestInfo(this.requestId).pipe(
      tap(request => {
        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/customer" },
          { label: `Заявка №${request.number}`, link: `/requests/customer/${request.id}` },
          { label: 'Согласование технико-коммерческих предложений', link: `/requests/customer/${this.requestId}/technical-commercial-proposals` }
        ];
      })
    );

    this.store.dispatch(new TechnicalCommercialProposals.Fetch(this.requestId));
  }

  ngAfterViewInit() {
    document.querySelector('.main-container').append(this.footer.nativeElement);
  }

  approveAll() {
    this.proposalsOnReview
      .filter(component => component.selectedProposalPosition.value)
      .forEach(component => component.approve(component.selectedProposalPosition.value));
  }

  rejectAll() {
    this.proposalsOnReview.forEach(component => component.reject());
  }

  trackByPositionId(i, item: TechnicalCommercialProposalGroupByPosition) {
    return item.position.id;
  }

  ngOnDestroy() {
    this.footer.nativeElement.remove();
  }
}

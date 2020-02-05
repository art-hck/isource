import { Component, OnDestroy, OnInit } from '@angular/core';
import { tap } from "rxjs/operators";
import { Request } from "../../../common/models/request";
import { UxgBreadcrumbsService } from "uxg";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { OffersService } from "../../services/offers.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestPosition } from "../../../common/models/request-position";
import { Observable, Subscription } from "rxjs";
import { ContragentList } from "../../../../contragent/models/contragent-list";

@Component({ templateUrl: './request-commercial-proposals.component.html' })
export class RequestCommercialProposalsComponent implements OnInit, OnDestroy {

  requestId: Uuid;
  request$: Observable<Request>;
  requestPositionsWithOffers$: Observable<any>;
  requestPositions: RequestPosition[] = [];
  requestPositions$: Observable<RequestPosition[]>;
  suppliers: ContragentList[] = [];

  subscription = new Subscription();

  showForm = false;

  currentRequestPosition: RequestPosition;

  constructor(private bc: UxgBreadcrumbsService,
              private route: ActivatedRoute,
              private requestService: RequestService,
              protected offersService: OffersService,
              protected router: Router
  ) {
    this.requestId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.request$ = this.requestService.getRequestInfo(this.requestId).pipe(
      tap(request => {
        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/backoffice" },
          { label: `Заявка №${request.number}`, link: `/requests/backoffice/${request.id}` },
          {
            label: 'Согласование коммерческих предложений',
            link: `/requests/backoffice/${this.requestId}/technical-proposals`
          }
        ];
      })
    );
    this.updatePositionsAndSuppliers();
  }

  protected updatePositionsAndSuppliers(): void {
    this.requestPositionsWithOffers$ = this.requestService.getRequestPositionsWithOffers(this.requestId);
  }

  sendForAgreement(requestId: Uuid, selectedRequestPositions: RequestPosition[]) {
    this.subscription.add(this.offersService.publishRequestOffers(requestId, selectedRequestPositions).subscribe(
      () => {
        this.updatePositionsAndSuppliers();
      }));
  }

  addCommercialProposal(): void {
    this.updatePositionsAndSuppliers();
  }

  onCancelPublishOffers(requestPosition: RequestPosition) {
    this.offersService.cancelPublishRequestOffers(this.requestId, requestPosition).subscribe(
      (updatedRequestPosition: RequestPosition) => {
        Object.assign(requestPosition, updatedRequestPosition);
        this.updatePositionsAndSuppliers();
      }
    );
  }

  showAddOfferModal(position: RequestPosition): void {
    this.currentRequestPosition = position;
    this.showForm = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { mapTo, publishReplay, refCount, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { TechnicalProposalsService } from "../../services/technical-proposals.service";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { RequestPosition } from "../../../common/models/request-position";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContragentService } from "../../../../contragent/services/contragent.service";

@Component({ templateUrl: './request-technical-proposals.component.html' })
export class RequestTechnicalProposalsComponent implements OnInit {
  requestId: Uuid;
  technicalProposals$: Observable<TechnicalProposal[]>;
  request$: Observable<Request>;
  positions$: Observable<RequestPosition[]>;
  contragents$: Observable<ContragentList[]>;
  showForm = false;

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private technicalProposalsService: TechnicalProposalsService,
    private contragentService: ContragentService,
  ) {
    this.requestId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.request$ = this.requestService.getRequestInfo(this.requestId).pipe(
      tap(request => {
        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/backoffice" },
          { label: `Заявка №${request.number}`, link: `/requests/backoffice/${request.id}` },
          { label: 'Согласование технических предложений', link: `/requests/backoffice/${this.requestId}/technical-proposals` }
        ];
      }));

    this.getTechnicalProposals();
    this.getTechnicalProposalsPositions();
    this.getTechnicalProposalsContragents();
  }

  getTechnicalProposals(filters = {}) {
    this.technicalProposals$ = this.technicalProposalsService.getTechnicalProposalsList(this.requestId, filters).pipe(
      tap(technicalProposals => this.showForm = technicalProposals.length === 0),
      publishReplay(1), refCount()
    );
  }

  filter(filters: {}) {
    this.technicalProposalsService.getTechnicalProposalsList(this.requestId, filters).subscribe(data => {
      this.technicalProposals$ = this.technicalProposals$.pipe(mapTo(data));
    });
  }

  getTechnicalProposalsPositions() {
    this.positions$ = this.technicalProposalsService.getTechnicalProposalsPositionsList(this.requestId);
  }

  getTechnicalProposalsContragents() {
    this.contragents$ = this.contragentService.getContragentList();
  }

  /**
   * @TODO uncomment when backend return technicalProposal data
   */
  addTechnicalProposal(technicalProposal) {
    this.getTechnicalProposals();
    // this.technicalProposals$ = this.technicalProposals$.pipe(
    //   map(technicalProposals => {
    //     technicalProposals.unshift(technicalProposal);
    //     return technicalProposals;
    //   })
    // );
  }

  /**
   * @TODO uncomment when backend return technicalProposal data
   */
  updateTechnicalProposal(technicalProposal) {
    this.getTechnicalProposals();
    // this.technicalProposals$ = this.technicalProposals$.pipe(
    //   map(technicalProposals => {
    //     const i = technicalProposals.findIndex(_technicalProposal => _technicalProposal.id === technicalProposal.id);
    //     technicalProposals[i] = technicalProposal;
    //
    //     return technicalProposals;
    //   }),
    //   publishReplay(1), refCount()
    // );
  }

  onCancelPublishTechnicalProposal(technicalProposal: TechnicalProposal) {
    const subscription = this.technicalProposalsService.cancelSendToAgreement(this.requestId, technicalProposal).subscribe(
      () => {
        this.getTechnicalProposals();
        subscription.unsubscribe();
      }
    );
  }
}

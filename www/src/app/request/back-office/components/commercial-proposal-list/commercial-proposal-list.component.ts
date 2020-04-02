import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { catchError, tap } from "rxjs/operators";
import { Request } from "../../../common/models/request";
import { UxgBreadcrumbsService } from "uxg";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { CommercialProposalsService } from "../../services/commercial-proposals.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestPosition } from "../../../common/models/request-position";
import { Observable, Subscription } from "rxjs";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { Store } from "@ngxs/store";
import { ClrModal } from "@clr/angular";

@Component({ templateUrl: './commercial-proposal-list.component.html' })
export class CommercialProposalListComponent implements OnInit, OnDestroy {
  @ViewChild('confirmToast', { static: false }) confirmToast: ClrModal;
  requestId: Uuid;
  request$: Observable<Request>;
  requestPositionsWithOffers$: Observable<any>;
  contragents$: Observable<ContragentList[]>;

  subscription = new Subscription();

  showForm = false;
  showEditForm = false;

  currentRequestPosition: RequestPosition;
  selectedLinkedOffer: any;
  selectedPositions: RequestPosition[] = [];

  get hasProsedure() {
    return this.selectedPositions.some(requestPosition => requestPosition.hasProcedure === true);
  }

  constructor(private bc: UxgBreadcrumbsService,
              private route: ActivatedRoute,
              private requestService: RequestService,
              private store: Store,
              protected offersService: CommercialProposalsService,
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
            link: `/requests/backoffice/${this.requestId}/commercial-proposals`
          }
        ];
      })
    );
    this.updatePositionsAndSuppliers();
  }

  protected updatePositionsAndSuppliers(): void {
    this.requestPositionsWithOffers$ = this.requestService.getRequestPositionsWithOffers(this.requestId);
  }

  publish() {
    this.subscription.add(
      this.offersService.publishRequestOffers(this.requestId, this.selectedPositions)
      .subscribe(() => this.updatePositionsAndSuppliers())
    );
  }

  onCancelPublishOffers(requestPosition: RequestPosition) {
    this.offersService.cancelPublishRequestOffers(this.requestId, requestPosition).subscribe(
      (updatedRequestPosition: RequestPosition) => {
        Object.assign(requestPosition, updatedRequestPosition);
        this.updatePositionsAndSuppliers();
      }
    );
  }

  addCommercialProposal(): void {
    this.updatePositionsAndSuppliers();
    this.showForm = false;
  }

  editCommercialProposal(): void {
    this.updatePositionsAndSuppliers();
    this.showEditForm = false;
  }

  showAddOfferModal(position: RequestPosition): void {
    this.currentRequestPosition = position;
    this.selectedLinkedOffer = null;

    this.showForm = true;
  }

  showEditOfferModal(data): void {
    this.currentRequestPosition = data.position;
    this.selectedLinkedOffer = data.linkedOffer;

    this.showEditForm = true;
  }

  updateContragents(positions: RequestPosition[]) {
    this.contragents$ = this.offersService.getContragentsWithTp(this.requestId, positions);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSendOffersTemplateFilesClick(files: File[]): void {
    this.offersService.addOffersFromExcel(this.requestId, files).pipe(
      tap(() => this.store.dispatch(new ToastActions.Success("Шаблон импортирован"))),
      tap(() => this.updatePositionsAndSuppliers()),
      catchError(({error}) => this.store.dispatch(
        new ToastActions.Error(`Ошибка в шаблоне${error && error.detail && ': ' + error.detail || ''}`)
      ))
    ).subscribe();
  }
}

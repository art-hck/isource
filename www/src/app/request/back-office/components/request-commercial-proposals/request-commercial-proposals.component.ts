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
import Swal from "sweetalert2";

@Component({ templateUrl: './request-commercial-proposals.component.html' })
export class RequestCommercialProposalsComponent implements OnInit, OnDestroy {

  requestId: Uuid;
  request$: Observable<Request>;
  requestPositionsWithOffers$: Observable<any>;
  contragents$: Observable<ContragentList[]>;

  subscription = new Subscription();

  showForm = false;
  showEditForm = false;

  currentRequestPosition: RequestPosition;
  selectedLinkedOffer: any;

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
    this.offersService.addOffersFromExcel(this.requestId, files).subscribe((data: any) => {
      Swal.fire({
        width: 400,
        html: '<p class="text-alert">' + 'Шаблон импортирован</br></br>' + '</p>' +
          '<button id="submit" class="btn btn-primary">' +
          'ОК' + '</button>',
        showConfirmButton: false,
        onBeforeOpen: () => {
          const content = Swal.getContent();
          const $ = content.querySelector.bind(content);

          const submit = $('#submit');
          submit.addEventListener('click', () => {
            this.updatePositionsAndSuppliers();
            Swal.close();
          });
        }
      });
    }, (error: any) => {
      let msg = 'Ошибка в шаблоне';
      if (error && error.error && error.error.detail) {
        msg = `${msg}: ${error.error.detail}`;
      }
      alert(msg);
    });
  }
}

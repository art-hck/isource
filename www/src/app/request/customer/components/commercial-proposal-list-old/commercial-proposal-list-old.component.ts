import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Request } from "../../../common/models/request";
import { ActivatedRoute, Router } from "@angular/router";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestService } from "../../services/request.service";
import { RequestPosition } from "../../../common/models/request-position";
import { RequestOfferPosition } from "../../../common/models/request-offer-position";
import { RequestDocument } from "../../../common/models/request-document";
import * as moment from "moment";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { PositionStatuses } from "../../../common/dictionaries/position-statuses";
import { PositionStatus } from "../../../common/enum/position-status";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContragentInfo } from "../../../../contragent/models/contragent-info";
import { UxgBreadcrumbsService } from "uxg";
import { Store } from "@ngxs/store";

@Component({
  selector: 'app-request-commercial-proposal-list-old',
  templateUrl: './commercial-proposal-list-old.component.html',
  styleUrls: ['./commercial-proposal-list-old.component.scss']
})

export class CommercialProposalListOldComponent implements OnInit {

  @ViewChild('tableBody', { static: false }) tableBody: ElementRef;
  @ViewChild('tableHeader', { static: false }) tableHeader: ElementRef;

  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[] = [];
  suppliers: ContragentList[] = [];

  contragent: ContragentInfo;

  linkedOfferDocuments: RequestDocument[] = [];
  commercialProposalsDocumentsModalOpened = false;

  selectedOffers = {};

  constructor(
    private bc: UxgBreadcrumbsService,
    private route: ActivatedRoute,
    protected router: Router,
    private requestService: RequestService,
    private store: Store
  ) { }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.updateRequestInfo();
    this.updatePositionsAndSuppliers();

  }

  getSupplierLinkedOffers(
    linkedOffers: RequestOfferPosition[],
    supplierId: Uuid
  ): RequestOfferPosition[] {
    return linkedOffers.filter(function(item) { return item.supplierContragent.id === supplierId; });
  }

  getSupplierInfo(supplierId: Uuid) {
    return this.requestPositions.filter(function (item) { return

    })
  }

  getTotalSumBySupplier(requestPositions: RequestPosition[], supplierId: Uuid): number {
    let sum = 0;

    requestPositions.forEach(pos => {
      const supplierLinkedOffer = this.getSupplierLinkedOffers(pos.linkedOffers, supplierId);
      if (supplierLinkedOffer[0]) {
        sum = sum + (supplierLinkedOffer[0].priceWithVat * supplierLinkedOffer[0].quantity);
      }
    });

    return sum;
  }

  getSelectedSumBySupplier(requestPositions: RequestPosition[], supplierId: Uuid): number {
    let selectedSum = 0;
    const selectedOffers = this.selectedOffers;

    requestPositions.forEach(pos => {
      const supplierLinkedOffers = this.getSupplierLinkedOffers(pos.linkedOffers, supplierId);

      supplierLinkedOffers.forEach(offer => {
        if ((offer.isWinner === true) || (Object.values(selectedOffers).indexOf(offer.id) > -1)) {
          selectedSum += offer.priceWithVat * offer.quantity;
        }
      });
    });

    return selectedSum;
  }

  correctDeliveryDate(linkedOfferDeliveryDate: string, requestPositionDeliveryDate: string): boolean {
    if (!requestPositionDeliveryDate) {
      return true;
    }

    const controlDate = moment(linkedOfferDeliveryDate);
    const validationDate = moment(requestPositionDeliveryDate);

    return controlDate.isSameOrBefore(validationDate);
  }

  protected updatePositionsAndSuppliers(): void {
    this.requestService.getRequestPositionsWithOffers(this.requestId).subscribe(
      (data: any) => {
        this.requestPositions = data.positions;
        this.suppliers = data.suppliers;
      }
    );
  }

  protected updateRequestInfo(): void {
    this.requestService.getRequest(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;

        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/customer"},
          { label: `Заявка №${this.request.number}`, link: "/requests/customer/" + this.request.id }
        ];
      }
    );
  }

  onSelectOffer(requestPosition: RequestPosition, supplier: string, linkedOffer: RequestOfferPosition): void {
    if (this.positionHasWinner(requestPosition)) {
      return;
    }

    if (this.selectedOffers[requestPosition.id] !== linkedOffer.id) {
      this.selectedOffers[requestPosition.id] = linkedOffer.id;
    } else {
      delete this.selectedOffers[requestPosition.id];
    }
  }

  canSelectOffersBySupplier(requestPositions: RequestPosition[], supplier: string): boolean {
    for (const requestPosition of requestPositions) {
      const supplierLinkedOffers = this.getSupplierLinkedOffers(requestPosition.linkedOffers, supplier);

      if (supplierLinkedOffers[0] && !this.positionHasWinner(requestPosition)) {
        return true;
      }
    }

    return false;
  }

  onSelectAll(requestPositions: RequestPosition[], supplier: string): void {
    this.selectedOffers = {};

    requestPositions.forEach(requestPosition => {
      const linkedOffers = this.getSupplierLinkedOffers(requestPosition.linkedOffers, supplier);

      linkedOffers.forEach(linkedOffer => {
        this.onSelectOffer(requestPosition, supplier, linkedOffer);
      });
    });
  }

  /**
   * Функция сохраняет список наиболее выгодных по стоимости предложений
   */
  onAutoselectOfferByMinPrice(): void {
    this.selectedOffers = {};

    this.requestPositions.forEach(position => {
      if (!this.positionHasWinner(position)) {
        const offerWithMinPrice = this.findOfferByMinPrice(position.linkedOffers);
        this.selectedOffers[position.id] = offerWithMinPrice.id;
      }
    });
  }

  /**
   * Функция находит среди предложений по позиции наиболее выгодную
   * @param positionOffers
   */
  findOfferByMinPrice(positionOffers: RequestOfferPosition[]): RequestOfferPosition {
    positionOffers = positionOffers.sort((offer1, offer2) => {
      const offer1price = offer1.priceWithVat * offer1.quantity;
      const offer2price = offer2.priceWithVat * offer2.quantity;

      const delta = offer1price - offer2price;

      if (delta < 0) {
        return -1;
      } else if (delta === 0) {
        return 0;
      }
      return 1;
    });

    return positionOffers[0];
  }

  onShowDocumentsModal(event: MouseEvent, linkedOfferDocuments: RequestDocument[]): void {
    event.stopPropagation();

    this.linkedOfferDocuments = linkedOfferDocuments;
    this.commercialProposalsDocumentsModalOpened = true;
  }

  getTotalSum(): number {
    let totalSum = 0;
    const selectedOffers = this.selectedOffers;

    this.requestPositions.forEach(pos => {
      pos.linkedOffers.forEach(offer => {
        if ((offer.isWinner === true) || (Object.values(selectedOffers).indexOf(offer.id) > -1)) {
          totalSum += offer.priceWithVat * offer.quantity;
        }
      });
    });

    return totalSum;
  }

  offerIsSelected(requestPosition: RequestPosition, supplier: string): boolean {
    const positionOffer = this.getSupplierLinkedOffers(requestPosition.linkedOffers, supplier);

    return positionOffer.some(offer => {
      return (this.selectedOffers && this.selectedOffers[offer.requestPositionId] === offer.id);
    });
  }

  offerIsWinner(linkedOffer: RequestOfferPosition): boolean {
    return linkedOffer.isWinner;
  }

  positionHasSelectedOffer(requestPosition: RequestPosition): boolean {
    return this.selectedOffers && this.selectedOffers[requestPosition.id] !== undefined;
  }

  positionHasWinner(requestPosition: RequestPosition): boolean {
    const currentStateIndex = PositionStatuses.indexOf(requestPosition.status);
    const positionHasWinnerIndex = PositionStatuses.indexOf(PositionStatus.WINNER_SELECTED);
    return (
      requestPosition &&
      currentStateIndex >= positionHasWinnerIndex
    );
  }

  sendForAgreement(): void {
    this.requestService.sendForAgreement(this.requestId, this.selectedOffers).subscribe(
      () => {
        this.store.dispatch(new ToastActions.Success('Успешно согласовано'));
        this.updatePositionsAndSuppliers();
        this.selectedOffers = {};
      },
      () => {
        this.store.dispatch(new ToastActions.Error('Не удалось согласовать предложения'));
      }
    );
  }

  /**
  * Функция возвращает надпись-ссылку с количеством неперечисленных в заявке позиций
  *
  * @param count
  */
  getDocumentCountLabel(count: number): string {
    const cases = [2, 0, 1, 1, 1, 2];
    const strings = ['документ', 'документа', 'документов'];

    const documentsString = strings[
      ( count % 100 > 4 && count % 100 < 20 ) ?
        2 :
        cases[
          (count % 10 < 5) ?
            count % 10 :
            5
          ]
      ];

    return count + ' ' + documentsString;
  }

  /**
   * Функция проверяет доступность кнопки отправки выбранных предложений на согласование
   */
  isSendButtonEnabled(): boolean {
    return Object.keys(this.selectedOffers).length > 0;
  }

  onSupplierListScroll(event) {
    const offsetX = Math.round(event.target.scrollLeft);
    this.tableBody.nativeElement.scrollTo(offsetX, 0);
    this.tableHeader.nativeElement.scrollTo(offsetX, 0);
  }


  makeReadableDate(date): string {
    return moment(date).locale("ru").format('LL');
  }

  validPositionsCount(requestPositions: RequestPosition[], supplier: string): boolean {
    for (const requestPosition of requestPositions) {
      const supplierLinkedOffers = this.getSupplierLinkedOffers(requestPosition.linkedOffers, supplier);
      if (supplierLinkedOffers[0] && supplierLinkedOffers[0].quantity !== requestPosition.quantity) {
        return false;
      }
    }

    return true;
  }

  validPositionsDeliveryDate(requestPositions: RequestPosition[], supplier: string): boolean {
    for (const requestPosition of requestPositions) {
      const supplierLinkedOffers = this.getSupplierLinkedOffers(requestPosition.linkedOffers, supplier);
      if (supplierLinkedOffers[0] &&
          !this.correctDeliveryDate(supplierLinkedOffers[0].deliveryDate, requestPosition.deliveryDate)
      ) {
        return false;
      }
    }

    return true;
  }

}

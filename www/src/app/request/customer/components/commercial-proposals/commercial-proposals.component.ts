import { Component, OnInit } from '@angular/core';
import { Request } from "../../../common/models/request";
import { ActivatedRoute, Router } from "@angular/router";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestService } from "../../services/request.service";
import { RequestPosition } from "../../../common/models/request-position";
import { RequestOfferPosition } from "../../../common/models/request-offer-position";
import { RequestDocument } from "../../../common/models/request-document";
import * as moment from "moment";

@Component({
  selector: 'app-commercial-proposals',
  templateUrl: './commercial-proposals.component.html',
  styleUrls: ['./commercial-proposals.component.scss']
})
export class CommercialProposalsComponent implements OnInit {

  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[] = [];
  suppliers: string[] = [];
  linkedOfferDocuments: RequestDocument[] = [];
  commercialProposalsDocumentsModalOpened = false;

  selectedOffers = {};

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private requestService: RequestService,
  ) { }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.updateRequestInfo();
    this.updatePositionsAndSuppliers();
  }

  getSupplierLinkedOffers(
    linkedOffers: RequestOfferPosition[],
    supplier: string
  ): RequestOfferPosition[] {
    return linkedOffers.filter(function(item) { return item.supplierContragentName === supplier; });
  }

  onRequestsClick() {
    this.router.navigateByUrl(`requests/customer`).then(r => {});
  }

  onRequestClick() {
    this.router.navigateByUrl(`requests/customer/${this.request.id}`).then(r => {});
  }

  getTotalSumBySupplier(requestPositions: RequestPosition[], supplier: string): number {
    let sum = 0;

    requestPositions.forEach(pos => {
      const supplierLinkedOffer = this.getSupplierLinkedOffers(pos.linkedOffers, supplier);
      if (supplierLinkedOffer[0]) {
        sum = sum + (supplierLinkedOffer[0].priceWithVat * supplierLinkedOffer[0].quantity);
      }
    });

    return sum;
  }

  incorrectDeliveryDate(linkedOfferDeliveryDate, requestPositionDeliveryDate): boolean {
    if (!requestPositionDeliveryDate) {
      return false;
    }

    const controlDate = moment(linkedOfferDeliveryDate);
    const validationDate = moment(requestPositionDeliveryDate);

    return controlDate.isBefore(validationDate);
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
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
  }

  onSelectOffer(requestPosition: RequestPosition, supplier: string, linkedOffer): void {
    if (this.selectedOffers[requestPosition.id] !== linkedOffer.id) {
      this.selectedOffers[requestPosition.id] = linkedOffer.id;
    } else {
      delete this.selectedOffers[requestPosition.id];
    }
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

  onShowDocumentsModal(event: any, linkedOfferDocuments: RequestDocument[]): void {
    event.stopPropagation();

    this.linkedOfferDocuments = linkedOfferDocuments;
    this.commercialProposalsDocumentsModalOpened = true;
  }

  getTotalSum(): number {
    let totalSum = 0;
    const selectedOffers = this.selectedOffers;

    this.requestPositions.forEach(pos => {
      pos.linkedOffers.forEach(offer => {
        if (Object.values(selectedOffers).indexOf(offer.id) > -1) {
          totalSum += offer.priceWithVat * offer.quantity;
        }
      });
    });

    return totalSum;
  }

  isSelected(requestPosition: RequestPosition, supplier: string): boolean {
    const positionOffer = this.getSupplierLinkedOffers(requestPosition.linkedOffers, supplier);

    return positionOffer.some(offer => {
      return (this.selectedOffers && this.selectedOffers[offer.requestPositionId] === offer.id);
    });
  }

  hasSelectedOffer(requestPosition: RequestPosition): boolean {
    return this.selectedOffers && this.selectedOffers[requestPosition.id] !== undefined;
  }

  sendForAgreement(): void {
    // todo Здесь будет запрос отправки выбранных предложений
    console.log(this.selectedOffers);
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

}

import { Component, OnInit } from '@angular/core';
import { Request } from "../../../common/models/request";
import { ActivatedRoute, Router } from "@angular/router";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestService } from "../../services/request.service";
import { RequestPosition } from "../../../common/models/request-position";
import { RequestOfferPosition } from "../../../common/models/request-offer-position";

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
    this.router.navigateByUrl(`requests/customer`);
  }

  onRequestClick() {
    this.router.navigateByUrl(`requests/customer/${this.request.id}`);
  }


  getTotalSumBySupplier(value, supplier): number {
    let sum = 0;

    value.forEach(pos => {
      const supplierLinkedOffer = this.getSupplierLinkedOffers(pos.linkedOffers, supplier);
      sum = sum + (supplierLinkedOffer[0].priceWithVat * supplierLinkedOffer[0].quantity);
    });

    return sum;
  }



  protected updatePositionsAndSuppliers(): void {
    this.requestService.getRequestPositionsWithOffers(this.requestId).subscribe(
      (data: any) => {
        this.requestPositions = data.positions;
        this.suppliers = data.suppliers;
      }
    );
  }

  protected updateRequestInfo() {
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
  }

  onSelectOffer(requestPosition, supplier, linkedOffer) {
    if (this.selectedOffers[requestPosition.id] !== linkedOffer.id) {
      this.selectedOffers[requestPosition.id] = linkedOffer.id;
    } else {
      delete this.selectedOffers[requestPosition.id];
    }
  }

  getTotalSum() {
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

  isSelected(requestPosition, supplier): boolean {
    const positionOffer = this.getSupplierLinkedOffers(requestPosition.linkedOffers, supplier);

    return positionOffer.some(offer => {
      return (this.selectedOffers && this.selectedOffers[offer.requestPositionId] === offer.id);
    });
  }

  hasSelectedOffer(requestPosition): boolean {
    return this.selectedOffers && this.selectedOffers[requestPosition.id] !== undefined;
  }



  sendForAgreement() {
    console.log(this.selectedOffers);
  }
}

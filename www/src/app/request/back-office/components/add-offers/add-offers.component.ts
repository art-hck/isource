import { Component, OnInit, ViewChild } from '@angular/core';
import { Request } from "../../../common/models/request";
import { RequestPosition } from "../../../common/models/request-position";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestViewComponent } from 'src/app/request/common/components/request-view/request-view.component';
import { RequestWorkflowSteps } from "../../../common/enum/request-workflow-steps";
import { RequestPositionWorkflowSteps } from "../../../common/enum/request-position-workflow-steps";
import { RequestOfferPosition } from "../../../common/models/request-offer-position";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { OffersService } from "../../services/offers.service";
import { RequestDocument } from "../../../common/models/request-document";

@Component({
  selector: 'app-add-offers',
  templateUrl: './add-offers.component.html',
  styleUrls: ['./add-offers.component.css']
})
export class AddOffersComponent implements OnInit {
  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[] = [];
  suppliers: string[] = [];

  showAddContragentModal = false;
  contragentName: string = '';

  showAddOfferModal = false;
  offerForm: FormGroup;

  showOfferModal = false;

  selectedRequestPosition: RequestPosition;
  selectedSupplier: string;
  selectedOffer: RequestOfferPosition;

  @ViewChild(RequestViewComponent, {static: false})
  requestView: RequestViewComponent;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private formBuilder: FormBuilder,
    protected offersService: OffersService,
    protected router: Router
  ) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.offerForm = this.formBuilder.group({
      priceWithVat: ['', [Validators.required, Validators.min(1)]],
      currency: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      measureUnit: ['', Validators.required],
      deliveryDate: ['', [Validators.required, CustomValidators.futureDate()]],
      paymentTerms: ['', Validators.required]
    });

    this.updateRequestInfo();
    this.updatePositionsAndSuppliers();
  }

  getSupplierLinkedOffers(
    linkedOffers: RequestOfferPosition[],
    supplier: string
  ): RequestOfferPosition[] {
    return linkedOffers.filter(function(item) { return item.supplierContragentName === supplier; });
  }

  onShowAddContragentModal() {
    this.showAddContragentModal = true;
  }

  onAddContragent() {
    this.suppliers.push(this.contragentName);
    this.suppliers.sort();

    this.showAddContragentModal = false;
    this.contragentName = '';
  }

  checkAddContragentButtonEnabled() {
    if (this.contragentName && this.contragentName.length) {
      return true;
    }
    return false;
  }

  onShowAddOfferModal(requestPosition: RequestPosition, supplier: string) {
    this.selectedRequestPosition = requestPosition;
    this.selectedSupplier = supplier;

    this.showAddOfferModal = true;
  }

  isFieldValid(field: string) {
    return this.offerForm.get(field).errors
      && (this.offerForm.get(field).touched || this.offerForm.get(field).dirty);
  }

  onAddOffer() {
    let formValue = this.offerForm.value;
    formValue.supplierContragentName = this.selectedSupplier;

    this.offersService.addOffer(this.requestId, this.selectedRequestPosition.id, formValue).subscribe(
      (data: RequestOfferPosition) => {
        this.updatePositionsAndSuppliers();
      }
    );
    this.showAddOfferModal = false;
    this.offerForm.reset();
  }

  onShowOfferModal(offer: RequestOfferPosition) {
    this.selectedOffer = offer;

    this.showOfferModal = true;
  }

  onUploadDocuments(files: File[], offer: RequestOfferPosition) {
    this.offersService.uploadDocuments(offer, files)
      .subscribe((documents: RequestDocument[]) => {
        documents.forEach(document => offer.documents.push(document));
        //this.notificationService.toast('Документ загружен');
      });
  }

  onUploadTechnicalProposals(files: File[], offer: RequestOfferPosition) {
    this.offersService.uploadTechnicalProposals(offer, files)
      .subscribe((documents: RequestDocument[]) => {
        documents.forEach(document => offer.technicalProposals.push(document));
        //this.notificationService.toast('Документ загружен');
      });
  }

  onRequestsClick() {
    this.router.navigateByUrl(`requests/back-office`);
  }

  onRequestClick() {
    this.router.navigateByUrl(`requests/back-office/${this.request.id}`);
  }

  onDownloadOffersTemplate() {
    this.offersService.downloadOffersTemplate(this.request);
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
}

import {Component, Input, OnInit} from '@angular/core';
import {Uuid} from "../../../../cart/models/uuid";
import {OffersService} from "../../services/offers.service";
import {ActivatedRoute} from "@angular/router";
import {RequestOfferPosition} from "../../../common/models/request-offer-position";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestPositionWorkflowSteps} from "../../../common/enum/request-position-workflow-steps";
import {RequestPosition} from "../../../common/models/request-position";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  @Input() requestPosition: RequestPosition;

  requestId: Uuid;
  offer: RequestOfferPosition;

  offerForm: FormGroup;
  showAddOfferForm = false;

  constructor(
    private offersService: OffersService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.offerForm = this.formBuilder.group({
      supplierContragentName: ['', Validators.required],
      priceWithVat: ['', Validators.required],
      currency: ['', Validators.required],
      quantity: ['', Validators.required],
      measureUnit: [''],
      deliveryDate: ['', Validators.required],
      paymentTerms: ['', Validators.required]
    });
  }

  isFieldValid(field: string) {
    return this.offerForm.get(field).errors
      && (this.offerForm.get(field).touched || this.offerForm.get(field).dirty);
  }

  onAddOffer() {
    this.offer = this.offerForm.value;
    this.offersService.addOffer(this.requestId, this.requestPosition.id, this.offer).subscribe(
      (data: RequestOfferPosition) => {
        this.requestPosition.linkedOffers.push(data);
      }
    );
    this.showAddOfferForm = false;
    this.offerForm.reset();
  }

  onShowAddOfferForm() {
    this.showAddOfferForm = !this.showAddOfferForm;
  }

  canAddOffer() {
    return this.requestPosition.status === RequestPositionWorkflowSteps.PROPOSALS_PREPARATION
      || this.requestPosition.status === RequestPositionWorkflowSteps.NEW;
  }
}

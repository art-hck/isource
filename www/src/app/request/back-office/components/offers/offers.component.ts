import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Input() customerView = false;

  @Output() offerWinner = new EventEmitter<Uuid>();

  requestId: Uuid;
  offer: RequestOfferPosition;
  offerWinnerId: Uuid;


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

    const winnerOffer = this.findDefaultOffer();
    if (winnerOffer) {
      this.offerWinnerId = winnerOffer.id;
      this.offerWinner.emit(this.offerWinnerId);
    }
  }

  findDefaultOffer() {
    const winner = this.findWinnerOffer();
    if (winner) {
      return winner;
    }
    return this.findMinPriceOffer();
  }

  findMinPriceOffer() {
    for (let i = 0; i < this.requestPosition.linkedOffers.length; i++) {
      if (this.requestPosition.linkedOffers[i].isMinPrice === true) {
        return this.requestPosition.linkedOffers[i];
      }
    }
    return null;
  }


  findWinnerOffer() {
    for (let i = 0; i < this.requestPosition.linkedOffers.length; i++) {
      if (this.requestPosition.linkedOffers[i].isWinner === true) {
        return this.requestPosition.linkedOffers[i];
      }
    }
    return null;
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
    return (this.requestPosition.status === RequestPositionWorkflowSteps.PROPOSALS_PREPARATION
      || this.requestPosition.status === RequestPositionWorkflowSteps.NEW) && !this.customerView;
  }

  winnerChoice(linkedOffer: RequestOfferPosition) {
    this.offerWinnerId = linkedOffer.id;
    this.offerWinner.emit(this.offerWinnerId);
  }

  canChoiceWinner() {
    console.log(this.requestPosition.status);
    return this.requestPosition.status === RequestPositionWorkflowSteps.RESULTS_AGREEMENT;
  }
}

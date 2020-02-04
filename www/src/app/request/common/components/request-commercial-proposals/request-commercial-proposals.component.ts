import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TechnicalProposal} from "../../models/technical-proposal";
import {RequestPosition} from "../../models/request-position";
import {RequestOfferPosition} from "../../models/request-offer-position";
import {ContragentList} from "../../../../contragent/models/contragent-list";
import {RequestPositionWorkflowSteps} from "../../enum/request-position-workflow-steps";
import * as moment from "moment";
import {Uuid} from "../../../../cart/models/uuid";
import {AbstractControl, FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {CustomValidators} from "../../../../shared/forms/custom.validators";
import {RequestPositionList} from "../../models/request-position-list";
import {ActivatedRoute, Route} from "@angular/router";

@Component({
  selector: 'app-request-commercial-proposals',
  templateUrl: './request-commercial-proposals.component.html',
  styleUrls: ['./request-commercial-proposals.component.scss']
})
export class RequestCommercialProposalsComponent implements OnInit {

  form: FormGroup;
  requestId: Uuid;

  @Input() requestPositions: RequestPosition[] = [];
  @Input() suppliers: ContragentList[];
  @Output() sentForAgreement = new EventEmitter<{ requestId: Uuid, selectedPositions: RequestPosition[] }>();
  @Output() addOffer = new EventEmitter<RequestPosition>();
  @Output() editOffer = new EventEmitter<{ position, linkedOffer }>();

  supplier: ContragentList;

  get formPositions() {
    return this.form.get('positions') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      checked: false,
      positions: this.fb.array([], CustomValidators.oneOrMoreSelected)
    });

    this.requestPositions.map(position => this.formPositions.push(
      this.createFormGroupPosition(position)));
  }

  createFormGroupPosition(position: RequestPositionList) {
    return this.fb.group({
      checked: false,
      position: position
    });
  }

  positionCanBeSelected(requestPosition: RequestPosition): boolean {
    return (
      requestPosition.linkedOffers.length !== 0 &&
      requestPosition.status === RequestPositionWorkflowSteps.PROPOSALS_PREPARATION
    );
  }

  canAddOffer(requestPosition: RequestPosition): boolean {
    return requestPosition.status === RequestPositionWorkflowSteps.PROPOSALS_PREPARATION;
  }

  positionIsSentForAgreement(requestPosition: RequestPosition): boolean {
    return requestPosition.status === RequestPositionWorkflowSteps.RESULTS_AGREEMENT;
  }

  positionWithWinner(requestPosition: RequestPosition): boolean {
    return requestPosition.status === RequestPositionWorkflowSteps.WINNER_SELECTED;
  }

  correctDeliveryDate(linkedOfferDeliveryDate: string, requestPositionDeliveryDate: string): boolean {
    if (!requestPositionDeliveryDate) {
      return true;
    }

    const controlDate = moment(linkedOfferDeliveryDate);
    const validationDate = moment(requestPositionDeliveryDate);

    return controlDate.isSameOrBefore(validationDate);
  }

  findSupplier(supplierId: Uuid): ContragentList {
    this.supplier = this.suppliers.find(supplier => supplier.id === supplierId);
    return this.supplier;
  }

  submit(controls: AbstractControl[]) {
    const selectedPositions = controls.filter(control => control.get('checked').value).map(control => control.get('position').value);
    this.sentForAgreement.emit({requestId: this.requestId, selectedPositions: selectedPositions});
  }

  newCommercialProposal(position) {
    this.addOffer.emit(position);
  }

  editCommercialProposal(position, linkedOffer) {
    this.editOffer.emit({position, linkedOffer});
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { RequestPositionWorkflowStepLabels } from "../../dictionaries/request-position-workflow-step-labels";
import { RequestPositionWorkflowSteps } from "../../enum/request-position-workflow-steps";
import { Uuid } from "../../../../cart/models/uuid";
import { OffersService } from "../../../back-office/services/offers.service";
import { Request } from "../../models/request";
import { RequestService as BackofficeRequestService } from "../../../back-office/services/request.service";
import { RequestService as CustomerRequestService } from "../../../customer/services/request.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RequestDocument } from "../../models/request-document";
import {EditRequestService} from "../../services/edit-request.service";
import {
  FormBuilder,
  FormGroup
} from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: 'app-position-info',
  templateUrl: './position-info.component.html',
  styleUrls: ['./position-info.component.css']
})
export class PositionInfoComponent implements OnInit {
  protected _opened = false;

  @Input()
  set showInfo(val) {
    this._opened = val;
    this.openedChange.emit(val);
  }

  get showInfo() {
    return this._opened;
  }

  @Input() positionInfoEditable: boolean;
  @Input() requestPosition: RequestPosition;
  @Input() requestId: Uuid;
  @Input() isCustomerView: boolean;

  // TODO оживить кнопку Закрыть карточку и Закрыть список позиций
  @Output() showPositionList = new EventEmitter<boolean>();
  @Output() openedChange = new EventEmitter<boolean>();
  @Output() updatePositionInfoEvent = new EventEmitter<boolean>();


  requestPositionWorkflowStepLabels = Object.entries(RequestPositionWorkflowStepLabels);
  offerWinner: Uuid;
  contractForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private offersService: OffersService,
    private backofficeRequestService: BackofficeRequestService,
    private editRequestService: EditRequestService,
    private customerRequestService: CustomerRequestService,
    private documentsService: DocumentsService
  ) { }


  ngOnInit() {
    this.contractForm = this.formBuilder.group({
      comments: [''],
      documents: [null]
    });
  }


  getDeliveryDate(val: any) {
    if (!moment(val, 'DD.MM.YYYY', true).isValid()) {
      return moment(val).format('DD.MM.YYYY');
    } else {
      return val;
    }
  }

  onPublishOffers(requestPosition: RequestPosition) {
    this.offersService.publishOffers(this.requestId, requestPosition.id).subscribe(
      (data: any) => {
        requestPosition.status = data.status;
        requestPosition.statusLabel = data.statusLabel;
      }
    );
  }

  canPublish(requestPosition: RequestPosition) {
    return (requestPosition.status === RequestPositionWorkflowSteps.PROPOSALS_PREPARATION
      || requestPosition.status === RequestPositionWorkflowSteps.NEW) && (requestPosition.linkedOffers.length !== 0)
      && !this.isCustomerView;
  }

  canChoiceWinner(requestPosition: RequestPosition) {
    return requestPosition.status === RequestPositionWorkflowSteps.RESULTS_AGREEMENT && this.isCustomerView;
  }

  getOfferWinner(offerWinner: Uuid) {
    this.offerWinner = offerWinner;
  }

  onChoiceWinner(requestPosition: RequestPosition) {
    this.customerRequestService.choiceWinner(this.offerWinner, requestPosition.id, this.requestId).subscribe(
      (data: any) => {
        requestPosition.status = data.status;
        requestPosition.statusLabel = data.statusLabel;
      }
    );
  }

  onChangeStatus(requestPosition: RequestPosition, newStatus: string) {
    this.backofficeRequestService.changeStatus(this.requestId, requestPosition.id, newStatus).subscribe(
      (data: any) => {
        requestPosition.status = data.status;
        requestPosition.statusLabel = data.statusLabel;
        if (data.requestStatus !== null) {
          this.backofficeRequestService.getRequestInfo(this.requestId).subscribe(
            (request: Request) => {}
          );
        }
      });
  }

  canDownloadContract(requestPosition: RequestPosition) {
    return requestPosition.status === RequestPositionWorkflowSteps.WINNER_SELECTED
      || requestPosition.status === RequestPositionWorkflowSteps.CONTRACT_SIGNING;
  }

  onUpdateInfo() {
    this.updatePositionInfoEvent.emit();
  }

  onChangeEditableFormState(state) {
    this.positionInfoEditable = state;
  }

  getUpdatedRequestPositionInfo(requestPosition: any) {
    console.log('triggered');
    this.requestPosition = requestPosition;
  }

  onUploadDocuments(files: File[]) {
    this.customerRequestService.uploadDocuments(this.requestPosition, files)
      .subscribe((documents: RequestDocument[]) => {
        documents.forEach(document => this.requestPosition.documents.push(document));
      });
  }
}

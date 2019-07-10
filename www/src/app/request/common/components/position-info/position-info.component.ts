import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RequestPosition} from "../../models/request-position";
import {RequestPositionWorkflowStepLabels} from "../../dictionaries/request-position-workflow-step-labels";
import {RequestPositionWorkflowSteps} from "../../enum/request-position-workflow-steps";
import {Uuid} from "../../../../cart/models/uuid";
import {OffersService} from "../../../back-office/services/offers.service";
import {Request} from "../../models/request";
import {RequestService as BackofficeRequestService} from "../../../back-office/services/request.service";
import {RequestService as CustomerRequestService} from "../../../customer/services/request.service";
import {FormBuilder, FormGroup} from "@angular/forms";

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

  @Input() requestPosition: RequestPosition;
  @Input() requestId: Uuid;
  @Input() isCustomerView: boolean;

  // TODO оживить кнопку Закрыть карточку и Закрыть список позиций
  @Output() showPositionList = new EventEmitter<boolean>();
  @Output() openedChange = new EventEmitter<boolean>();

  requestPositionWorkflowStepLabels = Object.entries(RequestPositionWorkflowStepLabels);
  offerWinner: Uuid;

  contractForm: FormGroup;

  constructor(
    private offersService: OffersService,
    private backofficeRequestService: BackofficeRequestService,
    private customerRequestService: CustomerRequestService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.contractForm = this.formBuilder.group({
      comments: [''],
      documents: [null]
    });
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
            (request: Request) => {
            }
          );
        }
      });
  }

  onClose() {
    this.showInfo = false;
  }

  onHiddenList() {
    this.showPositionList.emit();
  }
}

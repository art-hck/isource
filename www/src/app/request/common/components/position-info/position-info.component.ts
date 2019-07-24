import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { RequestPositionWorkflowStepLabels } from "../../dictionaries/request-position-workflow-step-labels";
import { RequestPositionWorkflowSteps } from "../../enum/request-position-workflow-steps";
import { Uuid } from "../../../../cart/models/uuid";
import { OffersService } from "../../../back-office/services/offers.service";
import { RequestService as BackofficeRequestService } from "../../../back-office/services/request.service";
import { RequestService as CustomerRequestService } from "../../../customer/services/request.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RequestDocument } from "../../models/request-document";
import {EditRequestService} from "../../services/edit-request.service";
import {ClrTabLink} from '@clr/angular';
import * as moment from "moment";

@Component({
  selector: 'app-position-info',
  templateUrl: './position-info.component.html',
  styleUrls: ['./position-info.component.css']
})
export class PositionInfoComponent implements OnInit, AfterViewInit {
  protected _opened = false;

  @Input()
  set showInfo(val) {
    this._opened = val;
    this.openedChange.emit(val);
  }

  get showInfo() {
    return this._opened;
  }

  @ViewChildren(ClrTabLink) tabLinks: QueryList<ClrTabLink>;

  @Input() positionInfoEditable: boolean;
  @Input() requestPosition: RequestPosition;
  @Input() requestId: Uuid;
  @Input() isCustomerView: boolean;

  // TODO оживить кнопку Закрыть карточку и Закрыть список позиций
  @Output() showPositionList = new EventEmitter<boolean>();
  @Output() openedChange = new EventEmitter<boolean>();
  @Output() changePositionInfo = new EventEmitter<boolean>();
  @Output() changeRequestInfo = new EventEmitter<boolean>();
  @Output() updatedRequestPositionItem = new EventEmitter<RequestPosition>();
  @Output() createdNewPosition = new EventEmitter<Uuid>();

  requestPositionWorkflowStepLabels = Object.entries(RequestPositionWorkflowStepLabels);
  offerWinner: Uuid;
  contractForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private offersService: OffersService,
    private backofficeRequestService: BackofficeRequestService,
    private editRequestService: EditRequestService,
    private customerRequestService: CustomerRequestService
  ) { }


  ngAfterViewInit() {
    this.tabLinks.changes.subscribe(tabChange => {

      // Проверяем, есть ли среди табов неактивный
      const noActiveTab = tabChange._results.every(function(tab) {
        return tab.active === false;
      });

      // Если есть, делаем активным самый первый таб с общей информацией
      if (noActiveTab) {
        setTimeout(() => {
          if (this.tabLinks.first) {
            this.tabLinks.first.activate();
          }
        });
      }
    });
  }

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
          this.changeRequestInfo.emit();
        }
      });
  }

  canDownloadContract(requestPosition: RequestPosition) {
    return (
      requestPosition &&
      (requestPosition.status === RequestPositionWorkflowSteps.WINNER_SELECTED
        || requestPosition.status === RequestPositionWorkflowSteps.CONTRACT_SIGNING)
    );
  }

  onUpdatePositionInfo() {
    this.changePositionInfo.emit();
  }

  onChangeEditableFormState(state) {
    this.positionInfoEditable = state;
  }

  getUpdatedRequestPositionInfo(requestPosition: any) {
    this.requestPosition = requestPosition;
    this.updatedRequestPositionItem.emit(requestPosition);
  }

  onUploadDocuments(files: File[]) {
    this.customerRequestService.uploadDocuments(this.requestPosition, files)
      .subscribe((documents: RequestDocument[]) => {
        documents.forEach(document => this.requestPosition.documents.push(document));
      });
  }

  onCreatedNewPosition(updatedPositionId: Uuid): void {
    this.createdNewPosition.emit(updatedPositionId);
  }
}

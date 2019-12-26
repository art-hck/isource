import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { RequestPositionWorkflowStepLabels } from "../../dictionaries/request-position-workflow-step-labels";
import { RequestPositionWorkflowSteps } from "../../enum/request-position-workflow-steps";
import { Uuid } from "../../../../cart/models/uuid";
import { OffersService } from "../../../back-office/services/offers.service";
import { RequestService as BackofficeRequestService } from "../../../back-office/services/request.service";
import { RequestService as CustomerRequestService } from "../../../customer/services/request.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RequestDocument } from "../../models/request-document";
import { EditRequestService } from "../../services/edit-request.service";
import { ClrTabLink } from '@clr/angular';
import * as moment from "moment";
import { NotificationService } from "../../../../shared/services/notification.service";
import { RequestPositionWorkflowStatuses } from '../../dictionaries/request-position-workflow-order';
import { RequestPositionDraftService } from "../../services/request-position-draft.service";

@Component({
  selector: 'app-position-info',
  templateUrl: './position-info.component.html',
  styleUrls: ['./position-info.component.css']
})
export class PositionInfoComponent implements OnInit, AfterViewInit {

  @ViewChildren(ClrTabLink) tabLinks: QueryList<ClrTabLink>;

  @Output() close = new EventEmitter();

  @Input() requestPosition: RequestPosition;
  @Output() requestPositionChanged = new EventEmitter<RequestPosition>();

  @Input() positionInfoEditable: boolean;
  @Output() positionInfoEditableChange = new EventEmitter<boolean>();

  @Input() requestId: Uuid;
  @Input() isCustomerView: boolean;

  @Input() fullScreen = false;
  @Output() fullScreenChange = new EventEmitter<boolean>();

  @Output() changeRequestInfo = new EventEmitter<boolean>();

  requestPositionWorkflowStepLabels = Object.entries(RequestPositionWorkflowStepLabels);
  contractForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private offersService: OffersService,
    private backofficeRequestService: BackofficeRequestService,
    private editRequestService: EditRequestService,
    private customerRequestService: CustomerRequestService,
    private notificationService: NotificationService,
    private requestPositionDraftService: RequestPositionDraftService
  ) {
  }

  ngAfterViewInit() {
    this.tabLinks.changes.subscribe(tabChange => {

      // Проверяем, есть ли среди табов неактивный
      const noActiveTab = tabChange._results.every(function (tab) {
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

  onConfirmPublishOffers(requestPosition: RequestPosition) {
    this.onPublishOffers(requestPosition);
  }

  onPublishOffers(requestPosition: RequestPosition) {
    this.offersService.publishOffers(this.requestId, requestPosition.id).subscribe(
      (data: any) => {
        requestPosition.status = data.status;
        requestPosition.statusLabel = data.statusLabel;
        this.notificationService.toast('Отправлено на согласование');
      }
    );
  }

  canPublish(requestPosition: RequestPosition) {
    return (requestPosition.status === RequestPositionWorkflowSteps.PROPOSALS_PREPARATION
      || requestPosition.status === RequestPositionWorkflowSteps.NEW) && (requestPosition.linkedOffers.length !== 0)
      && !this.isCustomerView;
  }

  onChangeStatus(requestPosition: RequestPosition, newStatus: string) {
    this.backofficeRequestService.changeStatus(this.requestId, requestPosition.id, newStatus).subscribe(
      (data: any) => {
        requestPosition.status = data.status;
        requestPosition.statusLabel = data.statusLabel;

        this.changeRequestInfo.emit();
      });
  }

  onRequestPositionChanged(requestPosition: any) {
    this.positionInfoEditable = false;
    this.requestPosition = requestPosition;
    this.requestPositionChanged.emit(requestPosition);
    // todo тут этот эмит не к месту, наверное следует перенсти в сеттер
    this.positionInfoEditableChange.emit(this.positionInfoEditable);
  }

  onUploadDocuments(files: File[]) {
    this.customerRequestService.uploadDocuments(this.requestPosition, files)
      .subscribe((documents: RequestDocument[]) => {
        this.notificationService.toast('Документ загружен');
        documents.forEach(document => this.requestPosition.documents.push(document));
      });
  }

  onPositionInfoEditableToggle() {
    this.positionInfoEditable = !this.positionInfoEditable;
    this.positionInfoEditableChange.emit(this.positionInfoEditable);
  }

  onWindowClose() {
    this.close.emit();
  }

  onWindowFull(flag: boolean) {
    this.fullScreen = flag;
    this.fullScreenChange.emit(this.fullScreen);
  }

  isNewPosition() {
    return !this.requestPosition.id;
  }

  canViewManufacturingAndDeliveryMonitor(requestPosition: RequestPosition): boolean {
    const deliveryStatusIndex = RequestPositionWorkflowStatuses.indexOf(
      RequestPositionWorkflowSteps.MANUFACTURING.valueOf()
    );
    const currentStatusIndex = RequestPositionWorkflowStatuses.indexOf(
      requestPosition.status
    );
    return currentStatusIndex >= deliveryStatusIndex;
  }

  canUploadManufacturing(requestPosition: RequestPosition): boolean {
    return (
      requestPosition.status === RequestPositionWorkflowSteps.MANUFACTURING &&
      !this.isCustomerView
    );
  }

  onDeleteDraft(): void {
    this.requestPositionDraftService.deleteRequestPositionDraft(this.requestPosition.id)
      .subscribe((requestPosition: RequestPosition) => {
        this.notificationService.toast('Черновик удален');
        this.requestPosition = requestPosition;
        this.requestPositionChanged.emit(requestPosition);
      });
  }

  getRelatedServicesList(requestPosition: RequestPosition): string {
    const relatedServices = [];

    if (requestPosition.isShmrRequired) {
      relatedServices.push('ШМР');
    }
    if (requestPosition.isPnrRequired) {
      relatedServices.push('ПНР');
    }
    if (requestPosition.isInspectionControlRequired) {
      relatedServices.push('Инспекционный контроль');
    }

    return relatedServices.join(', ');
  }

}

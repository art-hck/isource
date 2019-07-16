import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Uuid} from "../../../../cart/models/uuid";
import {Request} from "../../models/request";
import {RequestPosition} from "../../models/request-position";
import {RequestPositionWorkflowStepLabels} from "../../dictionaries/request-position-workflow-step-labels";
import {RequestTypes} from "../../enum/request-types";
import {CreateRequestPositionService} from "../../services/create-request-position.service";

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css']
})
export class RequestViewComponent implements OnInit {
  @Input() isCustomerView: boolean;
  @Input() requestId: Uuid;
  @Input() request: Request;
  @Input() requestPositions: RequestPosition[];

  @Output() updatePositionInfoEvent = new EventEmitter<boolean>();

  selectedRequestPosition: RequestPosition;
  showInfo = false;
  showRequestInfo: boolean;
  showPositionList = true;
  showUploadPositionsFromExcelForm = false;
  selectedIndex: number;

  constructor(
    private createRequestPositionService: CreateRequestPositionService
  ) {
  }

  ngOnInit() {
    this.showRequestInfo = this.request && this.request.type === RequestTypes.FREE_FORM;
  }

  onSelectPosition(requestPosition: RequestPosition, i: number) {
    this.selectedRequestPosition = requestPosition;
    this.showInfo = true;
    this.showRequestInfo = false;
    this.selectedIndex = i;
  }

  onSelectRequest() {
    this.showRequestInfo = true;
    this.showInfo = false;
  }

  onUpdateInfo(requestPosition: RequestPosition[]) {
    const index = requestPosition.map(el => el.id).indexOf(this.selectedRequestPosition.id);
    this.selectedRequestPosition = requestPosition[index];
    this.updatePositionInfoEvent.emit();
  }

  onUploadPositionsFromExcel() {
    this.showUploadPositionsFromExcelForm = !this.showUploadPositionsFromExcelForm;
  }

  onSendExcelFile(files: File[]): void {
    if (this.isCustomerView) {
      this.createRequestPositionService
        .addCustomerRequestPositionsFromExcel(this.request, files)
        .subscribe((data: any) => {
          // TODO перезагружать позиции
          window.location.href = window.location.href;
        }, (error: any) => {
          let msg = 'Ошибка в шаблоне';
          if (error && error.error && error.error.detail) {
            msg = `${msg}: ${error.error.detail}`;
          }
          alert(msg);
        });
    } else {
      this.createRequestPositionService
        .addCustomerRequestPositionsFromExcel(this.request, files)
        .subscribe((data: any) => {
          // TODO перезагружать позиции
          window.location.href = window.location.href;
        }, (error: any) => {
          let msg = 'Ошибка в шаблоне';
          if (error && error.error && error.error.detail) {
            msg = `${msg}: ${error.error.detail}`;
          }
          alert(msg);
        });
    }
  }
}

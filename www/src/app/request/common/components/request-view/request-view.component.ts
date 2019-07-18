import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Uuid} from "../../../../cart/models/uuid";
import {Request} from "../../models/request";
import {RequestPosition} from "../../models/request-position";
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
  @Input() updatedPosition: RequestPosition;

  @Output() changePositionInfo = new EventEmitter<boolean>();
  @Output() changeRequestInfo = new EventEmitter<boolean>();
  @Output() createdNewPosition = new EventEmitter<Uuid>();

  selectedRequestPosition: RequestPosition|null;
  showInfo = false;
  showRequestInfo: boolean;
  showPositionList = true;
  showUploadPositionsFromExcelForm = false;
  selectedIndex: number|null;
  positionInfoEditable = false;

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

  onUpdatePositionInfo(requestPosition: RequestPosition[]) {
    this.changePositionInfo.emit();
    this.selectedRequestPosition = requestPosition[this.selectedIndex];

    console.log('old this.requestPositions: ', this.requestPositions);
    console.log('this.updatedPosition: ', this.updatedPosition);
  }

  onUpdatedRequestPositionItem(updatedPosition: RequestPosition): void {

    console.log('OLD', this.requestPositions);

    this.requestPositions.forEach((position: RequestPosition) => {
      if (position.id === updatedPosition.id) {
        Object.assign(position, updatedPosition);
      }
    });
    console.log('NEW', this.requestPositions);
  }


  onUpdateRequestInfo() {
    this.changeRequestInfo.emit();
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

  addNewPosition(): void {
    const requestPosition = new RequestPosition();
    requestPosition.id = null;
    requestPosition.requestId = this.requestId;
    this.showInfo = true;
    this.positionInfoEditable = true;
    this.selectedRequestPosition = requestPosition;
  }

  onCreatedNewPosition(positionId: Uuid): void {
    this.selectedRequestPosition = null;
    this.showInfo = false;
    this.selectedIndex = null;
    this.positionInfoEditable = false;
    this.createdNewPosition.emit(positionId);
  }

  selectPosition(positionId: Uuid): void {
    console.log('!!!!!!!!!!!!!!!!!!', positionId);
    console.log('&&&&&&&&&&&&&&&&&', this.requestPositions);
    const {position, index} = this.getPositionById(positionId);
    if (!position) {
      return;
    }
    this.onSelectPosition(position, index);
  }

  protected getPositionById(positionId: Uuid): {position: RequestPosition|null, index: number|null} {
    for (let i = 0; i < this.requestPositions.length; i++) {
      const requestPosition = this.requestPositions[i];
      if (requestPosition.id === positionId) {
        return {position: requestPosition, index: i};
      }
    }
    return {position: null, index: null};
  }
}

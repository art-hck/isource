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

  selectedRequestPosition: RequestPosition|null;

  showPositionInfo = false;
  showRequestInfo = false;

  showPositionList = true;
  showUploadPositionsFromExcelForm = false;
  positionInfoEditable = false;

  protected newPositionName = 'Новая позиция';

  constructor(
    private createRequestPositionService: CreateRequestPositionService
  ) {
  }

  ngOnInit() {
    this.showRequestInfo = this.request && this.request.type === RequestTypes.FREE_FORM;
  }

  onSelectPosition(requestPosition: RequestPosition) {
    this.selectPosition(requestPosition);
    this.positionInfoEditable = false;
  }

  onSelectRequest($event) {
    this.selectPosition(null);
    this.showPositionInfo = false;
    this.showRequestInfo = $event;
  }

  onRequestPositionChanged(updatedPosition: RequestPosition): void {
    // делаем assign, чтобы не изменилась ссылка на объект и выделение позиции в гриде
    Object.assign(this.selectedRequestPosition, updatedPosition);
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
    requestPosition.name = this.newPositionName;
    requestPosition.requestId = this.requestId;

    this.requestPositions.unshift(requestPosition);

    this.onSelectPosition(requestPosition);
    this.positionInfoEditable = true;
  }

  onClosePositionInfo() {
    this.showPositionInfo = false;
    this.selectedRequestPosition = null;
    this.showPositionList = true;
  }

  onCloseRequestInfo() {
    this.showRequestInfo = false;
    this.showPositionList = true;
  }

  selectedIsNewPosition(): boolean {
    return this.selectedRequestPosition && !this.selectedRequestPosition.id;
  }

  protected selectPosition(requestPosition: RequestPosition|null) {
    // если добавляли позицию, но не сохранили, то удаляем ее
    if (this.selectedRequestPosition && !this.selectedRequestPosition.id) {
      this.requestPositions.shift();
    }

    this.selectedRequestPosition = requestPosition;
    this.showPositionInfo = true;
    this.showRequestInfo = false;
  }
}

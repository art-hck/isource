import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { Request } from "../../models/request";
import { RequestPosition } from "../../models/request-position";
import { RequestTypes } from "../../enum/request-types";
import { CreateRequestPositionService } from "../../services/create-request-position.service";
import { RequestGroup } from "../../models/request-group";
import { RequestPositionList } from "../../models/request-position-list";
import { RequestPositionListComponent } from "../request-position-list/request-position-list.component";

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css']
})
export class RequestViewComponent implements OnChanges {
  @ViewChild(RequestPositionList, {static: false}) requestPositionList: RequestPositionListComponent;

  @Input() isCustomerView: boolean;
  @Input() request: Request;
  @Input() requestPositions: RequestPositionList[] = [];
  @Input() updatedPosition: RequestPosition;

  @Output() changePositionInfo = new EventEmitter<boolean>();
  @Output() changeRequestInfo = new EventEmitter<boolean>();

  selectedRequestPosition: RequestPosition | null;
  selectedRequestGroup: RequestGroup | null;

  showPositionInfo = false;
  showRequestInfo = false;
  showGroupInfo = false;

  showPositionList = true;
  showUploadPositionsFromExcelForm = false;
  positionInfoEditable = false;
  groupInfoEditable = false;

  protected newPositionName = 'Новая позиция';
  protected newGroupName = 'Новая группа';

  constructor(
    private createRequestPositionService: CreateRequestPositionService,
  ) {
  }

  ngOnChanges() {
    this.showRequestInfo = this.request && this.request.type === RequestTypes.FREE_FORM;
  }

  onSelectPosition(requestPosition: RequestPosition) {
    this.resetSelectedItem();
    this.selectPosition(requestPosition);
    this.showPositionInfo = true;
  }

  onSelectRequest($event) {
    this.resetSelectedItem();
    this.selectPosition(null);
    this.showRequestInfo = $event;
  }

  onSelectGroup(requestListItem: RequestGroup) {
    this.resetSelectedItem();
    this.showGroupInfo = true;
    this.selectedRequestGroup = requestListItem;
  }

  onRequestPositionChanged(updatedPosition: RequestPosition): void {
    // делаем assign, чтобы не изменилась ссылка на объект и выделение позиции в гриде
    Object.assign(this.selectedRequestPosition, updatedPosition);
  }

  onRequestGroupChanged(updatedGroup: RequestGroup): void {
    Object.assign(this.selectedRequestGroup, updatedGroup);
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
    const requestPosition = new RequestPosition({
      id: null,
      name: this.newPositionName,
      requestId: this.request.id
    });

    this.requestPositions.unshift(requestPosition);

    this.onSelectPosition(requestPosition);
    this.positionInfoEditable = true;
    this.showGroupInfo = false;
    this.selectedRequestGroup = null;
  }

  addNewGroup(): void {
    const requestGroup = new RequestGroup({
      id: null,
      name: this.newGroupName,
      requestId: this.request.id
    });

    this.requestPositions.unshift(requestGroup);

    this.onSelectGroup(requestGroup);
    this.groupInfoEditable = true;
  }

  resetSelectedItem() {
    // если добавляли группу, но не сохранили, то удаляем ее
    if (this.selectedRequestGroup && !this.selectedRequestGroup.id) {
      this.requestPositions.shift();
    }
    // если добавляли позицию, но не сохранили, то удаляем ее
    if (this.selectedRequestPosition && !this.selectedRequestPosition.id) {
      this.requestPositions.shift();
    }
    this.showRequestInfo = false;
    this.showGroupInfo = false;
    this.showPositionInfo = false;
    this.selectedRequestGroup = null;
    this.selectedRequestPosition = null;
    this.groupInfoEditable = false;
    this.positionInfoEditable = false;
  }

  onClosePositionInfo() {
    this.showPositionInfo = false;
    this.showPositionList = true;

    this.resetSelectedItem();
  }

  onCloseGroupInfo() {
    this.showGroupInfo = false;
    this.showPositionList = true;

    this.resetSelectedItem();
  }

  onCloseRequestInfo() {
    this.showRequestInfo = false;
    this.showPositionList = true;
  }

  selectedIsNewPosition(): boolean {
    return (this.selectedRequestPosition && !this.selectedRequestPosition.id)
      || this.selectedRequestGroup && !this.selectedRequestGroup.id;
  }

  protected selectPosition(requestPosition: RequestPosition | null) {
    this.selectedRequestPosition = requestPosition;
    this.showPositionInfo = !!requestPosition;
    this.showRequestInfo = false;
    this.showGroupInfo = false;
  }
}

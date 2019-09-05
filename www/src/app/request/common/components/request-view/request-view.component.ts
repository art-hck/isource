import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Request } from "../../models/request";
import { RequestPosition } from "../../models/request-position";
import { RequestTypes } from "../../enum/request-types";
import { CreateRequestPositionService } from "../../services/create-request-position.service";
import { RequestGroup } from "../../models/request-group";
import { RequestPositionList } from "../../models/request-position-list";
import {GroupService} from "../../services/group.service";
import {RequestPositionListComponent} from "../request-position-list/request-position-list.component";
import { RequestPositionWorkflowSteps } from "../../enum/request-position-workflow-steps";

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css']
})
export class RequestViewComponent implements OnChanges {
  @ViewChild (RequestPositionList, {static: false}) requestPositionList: RequestPositionListComponent;


  @Input() filteredByDrafts: boolean;

  @Input() isCustomerView: boolean;
  @Input() requestId: Uuid;
  @Input() request: Request;
  @Input() requestPositions: RequestPositionList[] = [];
  @Input() updatedPosition: RequestPosition;

  @Output() changePositionInfo = new EventEmitter<boolean>();
  @Output() changeRequestInfo = new EventEmitter<boolean>();


  selectedRequestPosition: RequestPositionList|null;
  selectedRequestGroup: RequestPositionList|null;
  // requestGroups: RequestPositionList[] = [];
  // selectedPositions: RequestPositionList[];

  showPositionInfo = false;
  showRequestInfo = false;
  showGroupInfo = false;

  showPositionList = true;
  showUploadPositionsFromExcelForm = false;
  positionInfoEditable = false;
  groupInfoEditable = false;

  draftPositionsCount: number;

  protected newPositionName = 'Новая позиция';
  protected newGroupName = 'Новая группа';

  constructor(
    private createRequestPositionService: CreateRequestPositionService,
  ) {
  }

  ngOnChanges() {
    this.showRequestInfo = this.request && this.request.type === RequestTypes.FREE_FORM;
  }

  onSelectPosition(requestPosition: RequestPositionList) {
    this.resetSelectedItem();
    this.selectPosition(requestPosition);
    this.showPositionInfo = true;
  }

  onSelectRequest($event) {
    this.resetSelectedItem();
    this.selectPosition(null);
    this.showRequestInfo = $event;
  }

  onSelectGroup(requestListItem: RequestPositionList) {
    this.resetSelectedItem();
    this.showGroupInfo = true;
    this.selectedRequestGroup = requestListItem;
  }

  // // операции с позициями с помощью чекбоксов
  // onSelectedPosition($event) {
  //   this.selectedPositions = $event;
  // }

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
    const requestPosition = new RequestPosition();
    requestPosition.id = null;
    requestPosition.name = this.newPositionName;
    requestPosition.requestId = this.requestId;

    this.requestPositions.unshift(requestPosition);

    this.onSelectPosition(requestPosition);
    this.positionInfoEditable = true;
    this.showGroupInfo = false;
    this.selectedRequestGroup = null;
  }

  addNewGroup(): void {
    const requestGroup = new RequestGroup();
    requestGroup.id = null;
    requestGroup.name = this.newGroupName;
    requestGroup.requestId = this.requestId;

    this.requestPositions.unshift(requestGroup);
    // this.requestGroups.unshift(requestGroup);

    this.onSelectGroup(requestGroup);
    this.groupInfoEditable = true;
  }

  protected selectGroup(requestGroup: RequestGroup|null) {


    this.showRequestInfo = false;
    this.showPositionInfo = false;
    this.showGroupInfo = !!requestGroup;
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

  protected selectPosition(requestPosition: RequestPositionList|null) {
    this.selectedRequestPosition = requestPosition;
    this.showPositionInfo = !!requestPosition;
    this.showRequestInfo = false;
    this.showGroupInfo = false;
  }

  onDraftClick(): void {
    this.filteredByDrafts = !this.filteredByDrafts;
  }


  countDraftPositions(list?: RequestPositionList[]): number {
    let result = 0;

    if (!this.requestPositions || this.requestPositions.length === 0) {
      return 0;
    }

    if (!list) {
      list = this.requestPositions;
    }

    for (const item of list) {
      if (item.entityType === "GROUP") {
        const group = item as RequestGroup;
        result = result + this.countDraftPositions(group.positions);
      } else {
        const position = item as RequestPosition;
        if (position.status === RequestPositionWorkflowSteps.DRAFT) {
          result++;
        }
      }
    }

    return result;
  }
}

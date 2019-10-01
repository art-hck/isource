import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { Request } from "../../models/request";
import { RequestPosition } from "../../models/request-position";
import { RequestGroup } from "../../models/request-group";
import { RequestPositionList } from "../../models/request-position-list";
import { RequestPositionWorkflowSteps } from "../../enum/request-position-workflow-steps";
import {RequestPositionListComponent} from "../request-position-list/request-position-list.component";

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.scss']
})
export class RequestViewComponent implements OnChanges {
  @Input() filteredByDrafts: boolean;

  @Input() isCustomerView: boolean;
  @Input() request: Request;
  @Input() requestPositions: RequestPositionList[] = [];
  @Input() updatedPosition: RequestPosition;

  @Output() changePositionInfo = new EventEmitter<boolean>();
  @Output() changeRequestInfo = new EventEmitter<boolean>();
  @ViewChild(RequestPositionListComponent, {static: false}) requestPositionListComponent: RequestPositionListComponent;

  selectPositionListItem: any;
  showPositionList = true;

  constructor(
  ) {
  }

  ngOnChanges() {
  }

  onUpdateRequestInfo() {
    this.changeRequestInfo.emit();
  }

  onCloseInfoPanel() {
    this.selectPositionListItem = null;
    this.showPositionList = true;
    this.requestPositionListComponent.resetSelectedItem();
  }

  onRequestPositionChanged(updatedPosition: RequestPosition | RequestGroup): void {
    // делаем assign, чтобы не изменилась ссылка на объект и выделение позиции в гриде
    Object.assign(this.selectPositionListItem, updatedPosition);
  }

  isRequest(item: any): boolean {
    return item instanceof Request;
  }

  isPosition(item: any): boolean {
    return (item && item.entityType === 'POSITION');
  }

  isGroup(item: any): boolean {
    return (item && item.entityType === 'GROUP');
  }

  isNewRequestItem(selectPositionListItem: any) {
    return selectPositionListItem && !selectPositionListItem.id;
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

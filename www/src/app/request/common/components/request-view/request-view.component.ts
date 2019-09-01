import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { Request } from "../../models/request";
import { RequestPosition } from "../../models/request-position";
import { RequestGroup } from "../../models/request-group";
import { RequestPositionList } from "../../models/request-position-list";

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.scss']
})
export class RequestViewComponent implements OnChanges {
  @Input() isCustomerView: boolean;
  @Input() request: Request;
  @Input() requestPositions: RequestPositionList[] = [];
  @Input() updatedPosition: RequestPosition;

  @Output() changePositionInfo = new EventEmitter<boolean>();
  @Output() changeRequestInfo = new EventEmitter<boolean>();

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
  }

  onRequestPositionChanged(updatedPosition: RequestPosition | RequestGroup): void {
    // делаем assign, чтобы не изменилась ссылка на объект и выделение позиции в гриде
    Object.assign(this.selectPositionListItem, updatedPosition);
  }

  isRequest(item: any) {
    return item instanceof Request;
  }

  isPosition(item: any) {
    return item instanceof RequestPosition;
  }

  isGroup(item: any) {
    return item instanceof RequestGroup;
  }

  isNewRequestItem(selectPositionListItem: any) {
    return selectPositionListItem && !selectPositionListItem.id;
  }
}

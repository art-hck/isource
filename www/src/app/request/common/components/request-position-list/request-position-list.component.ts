import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Request } from "../../models/request";
import { RequestPositionList } from "../../models/request-position-list";

@Component({
  selector: 'app-request-position-list',
  templateUrl: './request-position-list.component.html',
  styleUrls: ['./request-position-list.component.scss']
})
export class RequestPositionListComponent implements OnInit {

  @Input() request: Request;
  @Input() requestPositions: RequestPositionList[];

  @Input() selectedRequestPosition: RequestPositionList | null;
  @Input() selectedRequestGroup: RequestPositionList | null;
  @Output() selectedRequestPositionChange = new EventEmitter<RequestPositionList>();
  @Output() selectedRequestGroupChange = new EventEmitter<RequestPositionList>();

  @Input() requestIsSelected: boolean;
  @Input() groupIsSelected: boolean;
  @Output() requestIsSelectedChange = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  onSelectItem(requestPosition: RequestPositionList) {
    if (requestPosition.entityType === 'POSITION') {
      this.onSelectPosition(requestPosition);
    } else {
      this.onSelectGroup(requestPosition);
    }
  }

  onSelectPosition(requestPosition: RequestPositionList) {
    this.requestIsSelected = false;
    this.selectedRequestGroup = null;
    this.selectedRequestPosition = requestPosition;
    this.selectedRequestPositionChange.emit(requestPosition);
  }

  onSelectGroup(requestGroup: RequestPositionList) {
    this.requestIsSelected = false;
    this.selectedRequestPosition = null;
    this.selectedRequestGroup = requestGroup;
    this.selectedRequestGroupChange.emit(requestGroup);
  }

  onSelectRequest() {
    this.requestIsSelected = true;
    this.requestIsSelectedChange.emit(this.requestIsSelected);
  }

  rowIsSelected(): boolean {
    return (this.selectedRequestPosition !== null && this.selectedRequestPosition !== undefined)
      || (this.selectedRequestGroup !== null && this.selectedRequestGroup !== undefined)
      || this.requestIsSelected;
  }

  isSelectedListItem(requestPosition: RequestPositionList): boolean {
    return (requestPosition === this.selectedRequestPosition
    || requestPosition === this.selectedRequestGroup) && !this.requestIsSelected;
  }
}

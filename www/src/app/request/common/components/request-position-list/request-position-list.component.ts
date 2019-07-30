import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Request } from "../../models/request";
import { RequestPosition } from "../../models/request-position";

@Component({
  selector: 'app-request-position-list',
  templateUrl: './request-position-list.component.html',
  styleUrls: ['./request-position-list.component.scss']
})
export class RequestPositionListComponent implements OnInit {

  @Input() request: Request;
  @Input() requestPositions: RequestPosition[];

  @Input() selectedRequestPosition: RequestPosition | null;
  @Output() selectedRequestPositionChange = new EventEmitter<RequestPosition>();

  @Input() requestIsSelected: boolean;
  @Output() requestIsSelectedChange = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  onSelectPosition(requestPosition: RequestPosition) {
    this.requestIsSelected = false;
    this.selectedRequestPosition = requestPosition;
    this.selectedRequestPositionChange.emit(requestPosition);
  }

  onSelectRequest() {
    this.requestIsSelected = true;
    this.requestIsSelectedChange.emit(this.requestIsSelected);
  }

  rowIsSelected(): boolean {
    return (this.selectedRequestPosition !== null && this.selectedRequestPosition !== undefined)
      || this.requestIsSelected;
  }
}

import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { Request } from "../../models/request";
import { RequestPositionList } from "../../models/request-position-list";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {RequestGroup} from "../../models/request-group";
import {RequestPosition} from "../../models/request-position";

@Component({
  selector: 'app-request-position-list',
  templateUrl: './request-position-list.component.html',
  styleUrls: ['./request-position-list.component.scss']
})
export class RequestPositionListComponent implements OnChanges {

  @Input() request: Request;
  @Input() requestPositions: RequestGroup[];

  @Input() selectedRequestPosition: RequestPositionList | null;
  @Input() selectedRequestGroup: RequestGroup | null;

  @Output() selectedRequestPositionChange = new EventEmitter<RequestPositionList>();
  @Output() selectedRequestGroupChange = new EventEmitter<RequestGroup>();
  @Output() selectedPositionChange = new EventEmitter<RequestPositionList[]>();

  @Input() requestIsSelected: boolean;
  @Input() groupIsSelected: boolean;
  @Output() requestIsSelectedChange = new EventEmitter<boolean>();

  positionList: FormGroup;
  selectedPositions: RequestPositionList[] = [];

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnChanges() {
    console.log(this.requestPositions);
    if(this.requestPositions) {
      this.positionList = this.formBuilder.group({
        reqPositions: this.formBuilder.array(this.requestPositions.map(element => {
          return this.formBuilder.control(false);
        }))
      });
    }
  }

  get positionsArray() {
    if(this.positionList) {
      return <FormArray>this.positionList.get('reqPositions');
    }
  }

  deletePosition(deleteIndex: number) {
    (<FormArray>this.positionList.get('reqPosition')).removeAt(deleteIndex);
  }

  getSelectedPositions() {
    this.selectedPositions = [];
    this.positionsArray.controls.forEach((control, i) => {
      if(control.value) {
        this.selectedPositions.push(this.requestPositions[i]);
      }
    });
    this.selectedPositionChange.emit(this.selectedPositions);
  }

  onSelectItem(requestPosition: RequestGroup) {
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

  onSelectGroup(requestGroup: RequestGroup) {
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

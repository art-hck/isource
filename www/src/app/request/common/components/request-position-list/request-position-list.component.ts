import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { Request } from "../../models/request";
import { RequestPositionList } from "../../models/request-position-list";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {RequestGroup} from "../../models/request-group";
import {RequestPosition} from "../../models/request-position";
import {GroupService} from "../../services/group.service";
import {Uuid} from "../../../../cart/models/uuid";
import {NotificationService} from "../../../../shared/services/notification.service";

@Component({
  selector: 'app-request-position-list',
  templateUrl: './request-position-list.component.html',
  styleUrls: ['./request-position-list.component.scss']
})
export class RequestPositionListComponent implements OnChanges {

  @Input() request: Request;
  @Input() requestPositions: RequestGroup[];
  @Input() requestId: Uuid;
  @Input() isCustomerView: boolean;

  @Input() selectedRequestPosition: RequestPositionList | null;
  @Input() selectedRequestGroup: RequestGroup | null;

  @Output() selectedRequestPositionChange = new EventEmitter<RequestPositionList>();
  @Output() selectedRequestGroupChange = new EventEmitter<RequestGroup>();

  @Input() requestIsSelected: boolean;
  @Input() groupIsSelected: boolean;
  @Output() requestIsSelectedChange = new EventEmitter<boolean>();

  positionListForm: FormGroup;
  selectedPositions: RequestPositionList[] = [];
  requestGroups: RequestGroup[];

  constructor(
    private formBuilder: FormBuilder,
    private groupService: GroupService,
    private notificationService: NotificationService
    ) {

  }

  ngOnChanges() {
    // обновляем массив контролов при каждом изменении списка позиций (добавление позиций и групп)
      this.positionListForm = this.formBuilder.group({
        positions: this.formBuilder.array(this.requestPositions.map(element => {
          return this.formBuilder.control(false);
        }))
      });
    this.getGroupList();
  }

  getGroupList() {
      this.requestGroups = this.requestPositions.filter(
        (requestPosition: RequestPositionList) => requestPosition.entityType === 'GROUP');
  }

  get positionsArray() {
      return <FormArray>this.positionListForm.get('positions');
  }

  onAddPositionsInGroup(requestGroup: RequestGroup) {
    this.groupService.addPositionsInGroup(this.requestId, requestGroup.id, this.selectedPositions).subscribe(
      () => {
        this.selectedPositions.forEach((selectedPosition: RequestPosition, i) => {
          selectedPosition.groupId = requestGroup.id;
          requestGroup.positions.push(selectedPosition);
        });
        this.selectedPositions.forEach((selectedPosition: RequestGroup, i) => {
          const deleteIndex = this.requestPositions.indexOf(selectedPosition);
          this.deletePosition(deleteIndex);
        });
        if (this.selectedPositions.length === 1) {
          this.notificationService.toast('Позиция добавлена в группу');
        } else {
          this.notificationService.toast('Позиции добавлены в группу');
        }
      }
    );
  }

  deletePosition(deleteIndex: number) {
    (<FormArray>this.positionListForm.get('positions')).removeAt(deleteIndex);
    this.requestPositions.splice(deleteIndex, 1);
  }

  getSelectedPositions() {
    this.selectedPositions = [];
    this.positionsArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedPositions.push(this.requestPositions[i]);
      }
    });
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

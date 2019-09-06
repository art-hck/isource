import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Request } from "../../models/request";
import { RequestPositionList } from "../../models/request-position-list";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { RequestGroup } from "../../models/request-group";
import { RequestPosition } from "../../models/request-position";
import { GroupService } from "../../services/group.service";
import { NotificationService } from "../../../../shared/services/notification.service";
import { CreateRequestPositionService } from "../../services/create-request-position.service";

@Component({
  selector: 'app-request-position-list',
  templateUrl: './request-position-list.component.html',
  styleUrls: ['./request-position-list.component.scss']
})
export class RequestPositionListComponent implements OnChanges {

  @Input() request: Request;
  @Input() requestItems: RequestPositionList[] ;
  @Input() isCustomerView: boolean;

  @Input() selectItem: Request | RequestGroup | RequestPosition;
  @Output() selectItemChange = new EventEmitter<Request | RequestGroup | RequestPosition>();

  positionListForm: FormGroup;
  requestGroups: RequestGroup[];
  selectedPositions: RequestPositionList[] = [];
  showUploadPositionsFromExcelForm = false;

  protected newPositionName = 'Новая позиция';
  protected newGroupName = 'Новая группа';

  constructor(
    private formBuilder: FormBuilder,
    private groupService: GroupService,
    private notificationService: NotificationService,
    private createRequestPositionService: CreateRequestPositionService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    // обновляем только если пришли новые позиции
    if (changes.requestItems) {
      // обновляем массив контролов при каждом изменении списка позиций (добавление позиций и групп)
      this.positionListForm = this.formBuilder.group({
        positions: this.formBuilder.array(this.requestItems.map(element => {
          return this.formBuilder.control(false);
        }))
      });
      this.getGroupList();
    }
  }

  getGroupList() {
    this.requestGroups = this.requestItems.filter(
      (requestPosition: RequestPositionList) => requestPosition.entityType === 'GROUP') as RequestGroup[];
  }

  get positionsArray() {
    return <FormArray>this.positionListForm.get('positions');
  }

  onAddPositionsInGroup(requestGroup: RequestGroup) {

    this.groupService.addPositionsInGroup(this.request.id, requestGroup.id, this.selectedPositions).subscribe(
      () => {
        this.selectedPositions.forEach((selectedPosition: RequestPosition, i) => {
          selectedPosition.groupId = requestGroup.id;
          requestGroup.positions.push(selectedPosition);
        });
        this.selectedPositions.forEach((selectedPosition: RequestPositionList, i) => {
          const deleteIndex = this.requestItems.indexOf(selectedPosition);
          this.deletePosition(deleteIndex);
        });
        const toastText = this.selectedPositions.length === 1 ?
          'Позиция добавлена в группу' :
          'Позиции добавлены в группу';
        this.notificationService.toast(toastText);
        this.selectedPositions = [];
      }
    );
  }

  deletePosition(deleteIndex: number) {
    (<FormArray>this.positionListForm.get('positions')).removeAt(deleteIndex);
    this.requestItems.splice(deleteIndex, 1);
  }

  getSelectedPositions() {
    this.selectedPositions = [];
    this.positionsArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedPositions.push(this.requestItems[i]);
      }
    });
  }

  onSelectItem(item: any) {
    this.resetSelectedItem();
    this.selectItem = item;
    this.selectItemChange.emit(this.selectItem);
  }

  isSelectedListItem(item: any): boolean {
    return item === this.selectItem;
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
      requestId: this.request.id,
      entityType: 'POSITION',
    });

    this.requestItems.unshift(requestPosition);
    this.positionsArray.insert(0, this.formBuilder.control(false));

    this.onSelectItem(requestPosition);
  }

  addNewGroup(): void {
    const requestGroup = new RequestGroup({
      id: null,
      name: this.newGroupName,
      requestId: this.request.id,
      entityType: 'GROUP',
    });

    this.requestItems.unshift(requestGroup);
    this.positionsArray.insert(0, this.formBuilder.control(false));

    this.onSelectItem(requestGroup);
  }

  resetSelectedItem() {
    // если добавляли позицию или группу, но не сохранили, то удаляем ее
    if (this.selectItem && !this.selectItem.id) {
      this.requestItems.shift();
      this.positionsArray.removeAt(0);
    }
  }

  selectedIsNewPosition(): boolean {
    return (this.selectItem && !this.selectItem.id);
  }

  onUploadPositionsFromExcel() {
    this.showUploadPositionsFromExcelForm = !this.showUploadPositionsFromExcelForm;
  }
}

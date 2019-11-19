import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Request } from "../../models/request";
import { RequestPositionList } from "../../models/request-position-list";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { RequestGroup } from "../../models/request-group";
import { RequestPosition } from "../../models/request-position";
import { GroupService } from "../../services/group.service";
import { NotificationService } from "../../../../shared/services/notification.service";
import { CreateRequestPositionService } from "../../services/create-request-position.service";
import { RequestPositionWorkflowSteps } from "../../enum/request-position-workflow-steps";
import { Observable } from "rxjs";
import { RequestOfferPosition } from "../../models/request-offer-position";

@Component({
  selector: 'app-request-position-list',
  templateUrl: './request-position-list.component.html',
  styleUrls: ['./request-position-list.component.scss']
})
export class RequestPositionListComponent implements OnChanges, OnInit {

  @Input() request: Request;
  @Input() requestItems: RequestPositionList[] ;
  @Input() isCustomerView: boolean;

  @Input() selectItem: Request | RequestGroup | RequestPosition;
  @Output() selectItemChange = new EventEmitter<Request | RequestGroup | RequestPosition>();

  @Input() filteredByDrafts: boolean;

  positionListForm: FormGroup;
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

  ngOnInit() {
    this.updatePositionListForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    // обновляем массив контролов при каждом изменении списка позиций (добавление позиций и групп)
    if (changes.requestItems && this.requestItems && this.requestItems.length > 0) {
      this.updatePositionListForm();
    }
  }

  get requestGroups(): RequestGroup[] {
    return this.requestItems.filter(
      (requestPosition: RequestPositionList) => requestPosition.entityType === 'GROUP') as RequestGroup[];
  }

  get positionsArray(): FormArray {
    return <FormArray>this.positionListForm.get('positions');
  }

  onAddPositionsInGroup(requestGroup: RequestGroup) {

    this.groupService.addPositionsInGroup(this.request.id, requestGroup.id, this.selectedPositions).subscribe(
      () => {
        this.selectedPositions.forEach((selectedPosition: RequestPosition) => {
          selectedPosition.groupId = requestGroup.id;
          requestGroup.positions.push(selectedPosition);
        });
        this.selectedPositions.forEach((selectedPosition: RequestPositionList) => {
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

  onSendExcelFile(requestData: { files: File[], requestName: string }): void {
    const addPositionObservable: Observable<any> = this.isCustomerView ?
      this.createRequestPositionService.addCustomerRequestPositionsFromExcel(this.request, requestData.files) :
      this.createRequestPositionService.addBackofficeRequestPositionsFromExcel(this.request, requestData.files);

    addPositionObservable.subscribe((data: any) => {
      // TODO реализовать без перезагрузки страницы
      window.location.reload();
    }, (error: any) => {
      let msg = 'Ошибка в шаблоне';
      if (error && error.error && error.error.detail) {
        msg = `${msg}: ${error.error.detail}`;
      }
      alert(msg);
    });
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
      positions: [],
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

  isDraftPositionShown(position) {
    if (
      position.entityType === "GROUP" &&
      position.positions.length > 0 &&
      position.positions.some(pos => pos.status === RequestPositionWorkflowSteps.DRAFT)
    ) {
      return true;
    }

    if (this.filteredByDrafts === true) {
      return (position.status === RequestPositionWorkflowSteps.DRAFT);
    } else {
      return true;
    }
  }

  /**
   * Перестраивает форму списка позиций в записимости от списка позиций
   */
  protected updatePositionListForm() {
    const controls = this.requestItems ?
      this.requestItems.map(() => {
        return this.formBuilder.control(false);
      }) :
      [];

    this.positionListForm = this.formBuilder.group({
      positions: this.formBuilder.array(controls)
    });
  }

  getWinner(position: RequestPosition): RequestOfferPosition | undefined {
    if (position && position.linkedOffers) {
      return position.linkedOffers.find(offer => offer.isWinner);
    }
    return undefined;
  }
}

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { History } from "../../models/history";
import { RequestPositionHistoryService } from "../../services/request-position-history.service";
import * as moment from "moment";

@Component({
  selector: 'app-position-info-history',
  templateUrl: './position-info-history.component.html',
  styleUrls: ['./position-info-history.component.scss']
})
export class PositionInfoHistoryComponent implements OnInit, OnChanges {

  @Input() requestPosition: RequestPosition;

  history: History[];

  constructor(
    private historyService: RequestPositionHistoryService
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getHistory();
  }

  ngOnInit() {
    this.getHistory();
  }

  getHistory(): void {
    this.historyService.getHistory(this.requestPosition)
      .subscribe((history: History[]) => {
        this.history = history;
        console.log(this.history);
      });
  }

  isDocumentUploadAction(activityItem: History): boolean {
    return (
      [
        'DOC_POSITION',
        'DOC_OFFER',
        'DOC_TECHPROPOSALS',
        'DOC_MESSAGE',
        'DOC_CONTRACT',
        'DOC_MANUFACTURING'
      ].indexOf(activityItem.type) !== -1
    );
  }

  downloadDocument(documentId, documentName) {
    this.historyService.downloadFileFromHistory(documentId, documentName);
  }

  isPositionEditAction(activityItem: History): boolean {
    return activityItem.type === 'POSITION_EDITED';
  }

  /**
   * Функция определяет относится ли активность к типу смены статуса или добавления позиции
   * @param activityItem
   */
  isStatusChangeAction(activityItem: History): boolean {
    return (
      [
      'POSITION_STATUS',
      'POSITION_ADDED'
      ].indexOf(activityItem.type) !== -1
    );
  }

  /**
   * Функция возвращает список классов для html-элемента в зависимости от типа активности
   * @param activityItem
   */
  getActivityTypeStatusClass(activityItem: History): string {
    const positionStatus = this.isStatusChangeAction(activityItem) ?
      activityItem.data.newStatus + ' status-change' :
      activityItem.status;

    return 'status-dot ' + 'position-history-status-' + positionStatus;
  }

  /**
   * Функция приводит полный ФИО пользователя в формат Иванов И. И.
   * @param activityItem
   */
  getUserName(activityItem: History): string {
    const lastName = activityItem.user.lastName;
    const firstName = activityItem.user.firstName.charAt(0);
    const middleName = activityItem.user.middleName ? activityItem.user.middleName.charAt(0) + '.' : '';

    return lastName + ' ' + firstName + '. ' + middleName;
  }

  /**
   * Функция приводит возвращаемые данные редактирования позиции в более удобный для фронта вид
   * @param data
   */
  getPositionEditInfoList(data): Array<any> {
    const positionEditInfo = [];

    Object.entries(data.oldValues).forEach(([key, value]) => {

      let oldValue = value;
      let newValue = data.newValues[key];

      if (key === 'deliveryDate') {
        oldValue = value ? moment(value).format('DD.MM.YYYY') : 'нет даты';
        newValue = newValue ? moment(newValue).format('DD.MM.YYYY') : 'нет даты';
      }

      if (key === 'isDeliveryDateAsap') {
        oldValue = (value === false) ? 'Нет' : 'Да';
        newValue = (value === false) ? 'Да' : 'Нет';
      }

      positionEditInfo.push({
        'label': this.getEditedFieldLabel(key),
        'oldValue': oldValue,
        'newValue': newValue
      });
    });

    return positionEditInfo;
  }

  getEditedFieldLabel(field) {
    switch (field) {
      case 'currency':
        return 'Валюта';
      case 'deliveryBasis':
        return 'Базис поставки';
      case 'deliveryDate':
        return 'Дата поставки';
      case 'isDeliveryDateAsap':
        return 'Срочная поставка';
      case 'measureUnit':
        return 'Единица измерения';
      case 'name':
        return 'Наименование позиции';
      case 'productionDocument':
        return 'Документ изготовления';
      case 'quantity':
        return 'Количество';
      case 'startPrice':
        return 'Начальная максимальная цена';
      default:
        return '';
    }
  }
}

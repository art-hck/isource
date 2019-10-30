import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { History } from "../../models/history";
import { RequestPositionHistoryService } from "../../services/request-position-history.service";
import * as moment from "moment";
import { PositionHistoryTypes } from "../../enum/position-history-types";
import { Uuid } from "../../../../cart/models/uuid";
import { PositionInfoFieldsLabels } from "../../dictionaries/position-info-fields-labels";
import { ContragentInfo } from "../../../../contragent/models/contragent-info";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { Observable } from "rxjs";
import { publishReplay, refCount } from "rxjs/operators";

@Component({
  selector: 'app-position-info-history',
  templateUrl: './position-info-history.component.html',
  styleUrls: ['./position-info-history.component.scss']
})
export class PositionInfoHistoryComponent implements OnInit, OnChanges {

  @Input() requestPosition: RequestPosition;

  contragent: ContragentInfo;
  contragentInfoModalOpened = false;
  history: History[];

  constructor(
    protected getContragentService: ContragentService,
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
      });
  }

  isDocumentUploadAction(activityItem: History): boolean {
    return (
      [
        PositionHistoryTypes.DOC_POSITION.valueOf(),
        PositionHistoryTypes.DOC_OFFER.valueOf(),
        PositionHistoryTypes.DOC_TECHPROPOSALS.valueOf(),
        PositionHistoryTypes.DOC_MESSAGE.valueOf(),
        PositionHistoryTypes.DOC_CONTRACT.valueOf(),
        PositionHistoryTypes.DOC_MANUFACTURING.valueOf(),
      ].indexOf(activityItem.type) !== -1
    );
  }

  downloadDocument(documentId: Uuid, documentName: string): void {
    this.historyService.downloadFileFromHistory(documentId, documentName);
  }

  showContragentInfo(event: MouseEvent, contragentId: Uuid): void {
    // При клике не даём открыться ссылке из href, вместо этого показываем модальное окно
    event.preventDefault();

    this.contragentInfoModalOpened = true;

    if (!this.contragent || this.contragent.id !== contragentId) {
      this.contragent = null;

      const subscription = this.getContragentService
        .getContragentInfo(contragentId)
        .subscribe(contragentInfo => {
          this.contragent = contragentInfo;
          subscription.unsubscribe();
        });
    }
  }

  isPositionEditAction(activityItem: History): boolean {
    return activityItem.type === PositionHistoryTypes.POSITION_EDITED.valueOf();
  }

  /**
   * Функция определяет относится ли активность к типу смены статуса или добавления позиции
   * @param activityItem
   */
  isStatusChangeAction(activityItem: History): boolean {
    return (
      [
        PositionHistoryTypes.POSITION_STATUS.valueOf(),
        PositionHistoryTypes.POSITION_ADDED.valueOf(),
        PositionHistoryTypes.OFFER_STATUS.valueOf(),
        PositionHistoryTypes.WINNER_STATUS.valueOf(),
        PositionHistoryTypes.CONTRACT_STATUS.valueOf(),
        PositionHistoryTypes.POSITION_TECHNICAL_PROPOSAL_STATUS.valueOf(),
        PositionHistoryTypes.DESIGN_STATUS.valueOf()
      ].indexOf(activityItem.type) !== -1
    );
  }

  /**
   * Функция определяет относится ли активность к типу выбора победителя
   * @param activityItem
   */
  isPositionWinnerSelectedAction(activityItem: History): boolean {
    return activityItem.type === PositionHistoryTypes.WINNER_ADDED.valueOf();
  }

  /**
   * Функция определяет относится ли активность к типу удаления победителя
   * @param activityItem
   */
  isPositionWinnerRemovedAction(activityItem: History): boolean {
    return activityItem.type === PositionHistoryTypes.WINNER_REMOVED.valueOf();
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
  getPositionEditInfoList(data): Array<{label: string, oldValue: any, newValue: any}> {
    const positionEditInfo = [];

    Object.entries(data.oldValues).forEach(([key, value]) => {

      let oldValue = value;
      let newValue = data.newValues[key];

      if (key === 'deliveryDate') {
        oldValue = value ? moment(value).format('DD.MM.YYYY') : 'как можно скорее';
        newValue = newValue ? moment(newValue).format('DD.MM.YYYY') : 'как можно скорее';
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

  getEditedFieldLabel(field: string): string {
    return PositionInfoFieldsLabels.hasOwnProperty(field) ? PositionInfoFieldsLabels[field] : '';
  }
}

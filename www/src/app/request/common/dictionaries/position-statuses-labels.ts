import {PositionStatus} from "../enum/position-status";

export const PositionStatusesLabels: Record<PositionStatus, string> = {
  [PositionStatus.DRAFT]: 'Черновик',
  [PositionStatus.ON_CUSTOMER_APPROVAL]: 'На согласовании заказчика',
  [PositionStatus.NEW]: 'Новая',
  [PositionStatus.TECHNICAL_PROPOSALS_PREPARATION]: 'Подготовка ТП',
  [PositionStatus.TECHNICAL_PROPOSALS_AGREEMENT]: 'Согласование ТП',
  [PositionStatus.TECHNICAL_COMMERCIAL_PROPOSALS_PREPARATION]: 'Подготовка ТКП',
  [PositionStatus.TECHNICAL_COMMERCIAL_PROPOSALS_AGREEMENT]: 'Согласование ТКП',
  [PositionStatus.PROPOSALS_PREPARATION]: 'Подготовка КП',
  [PositionStatus.RESULTS_AGREEMENT]: 'Выбор победителя',
  [PositionStatus.WINNER_SELECTED]: 'Выбран победитель',
  [PositionStatus.CONTRACT_AGREEMENT]: 'Согласование договора',
  [PositionStatus.CONTRACT_SIGNING]: 'Подписание договора',
  [PositionStatus.CONTRACTED]: 'Законтрактовано',
  [PositionStatus.RKD_AGREEMENT]: 'Согласование РКД',
  [PositionStatus.MANUFACTURING]: 'Изготовление',
  [PositionStatus.DELIVERY]: 'Доставка',
  [PositionStatus.DELIVERED]: 'Поставлено',
  [PositionStatus.PAID]: 'Оплачено',
  [PositionStatus.COMPLETED]: 'Завершено',
};


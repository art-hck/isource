import { PositionStatus } from "../enum/position-status";

export const PositionStatusesLabels: Record<PositionStatus, string> = {
  [PositionStatus.DRAFT]: 'Черновик',
  [PositionStatus.ON_CUSTOMER_APPROVAL]: 'На согласовании заказчика',
  [PositionStatus.NEW]: 'Новая',
  [PositionStatus.TECHNICAL_PROPOSALS_PREPARATION]: 'Подготовка ТП',
  [PositionStatus.TECHNICAL_PROPOSALS_AGREEMENT]: 'Согласование ТП',
  [PositionStatus.PROPOSALS_PREPARATION]: 'Подготовка КП',
  [PositionStatus.RESULTS_AGREEMENT]: 'Выбор победителя',
  [PositionStatus.WINNER_SELECTED]: 'Выбран победитель',
  [PositionStatus.TECHNICAL_COMMERCIAL_PROPOSALS_PREPARATION]: 'Подготовка ТКП',
  [PositionStatus.TECHNICAL_COMMERCIAL_PROPOSALS_AGREEMENT]: 'Согласование ТКП',
  [PositionStatus.TCP_WINNER_SELECTED]: 'Выбран победитель ТКП',
  [PositionStatus.CONTRACT_AGREEMENT]: 'Согласование договора',
  [PositionStatus.CONTRACT_SIGNING]: 'Подписание договора',
  [PositionStatus.CONTRACTED]: 'Законтрактовано',
  [PositionStatus.RKD_AGREEMENT]: 'Согласование РКД',
  [PositionStatus.RKD_APPROVED]: 'РКД согласована',
  [PositionStatus.MANUFACTURING]: 'Изготовление',
  [PositionStatus.DELIVERY]: 'Доставка',
  [PositionStatus.DELIVERED]: 'Поставлено',
  [PositionStatus.RELATED_SERVICES_EXECUTION]: 'Оказание сопутствующих услуг',
  [PositionStatus.PAID]: 'Оплачено',
  [PositionStatus.WARRANTY]: 'Гарантийные обязательства',
  [PositionStatus.COMPLETED]: 'Завершено',
  [PositionStatus.NOT_RELEVANT]: 'Неактуально',
  [PositionStatus.CANCELED]: 'Отменено'
};

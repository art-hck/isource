export enum PositionStatus {
  DRAFT = 'DRAFT',                                 // Черновик
  ON_CUSTOMER_APPROVAL = 'ON_CUSTOMER_APPROVAL',   // На согласовании заказчика
  NEW = 'NEW',                                     // Новая
  TECHNICAL_PROPOSALS_PREPARATION = 'TECHNICAL_PROPOSALS_PREPARATION', // Подготовка ТП
  TECHNICAL_PROPOSALS_AGREEMENT = 'TECHNICAL_PROPOSALS_AGREEMENT',     // Согласование ТП
  PROPOSALS_PREPARATION = 'PROPOSALS_PREPARATION', // Подготовка КП
  RESULTS_AGREEMENT = 'RESULTS_AGREEMENT',         // Согласование результатов
  WINNER_SELECTED = 'WINNER_SELECTED',             // Выбран победитель
  CONTRACT_AGREEMENT = 'CONTRACT_AGREEMENT',       // Согласование договора
  CONTRACT_SIGNING = 'CONTRACT_SIGNING',           // Подписание договора
  CONTRACTED = 'CONTRACTED',                       // Законтрактовано
  RKD_AGREEMENT = 'RKD_AGREEMENT',                 // Согласование РКД
  MANUFACTURING = 'MANUFACTURING',                 // Изготовление
  DELIVERY = 'DELIVERY',                           // Доставка
  DELIVERED = 'DELIVERED',                         // Поставлено
  PAID = 'PAID',                                   // Оплачено
  COMPLETED = 'COMPLETED',                         // Завершено
}

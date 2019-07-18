export enum RequestPositionWorkflowSteps {
  NEW = 'NEW',                                     // Новая
  PROPOSALS_PREPARATION = 'PROPOSALS_PREPARATION', // Подготовка предложения
  RESULTS_AGREEMENT = 'RESULTS_AGREEMENT',         // Согласование результатов
  WINNER_SELECTED = 'WINNER_SELECTED',             // Выбран победитель
  CONTRACT_CONCLUSION = 'CONTRACT_CONCLUSION',     // Согласование договора
  CONTRACT_SIGNING = 'CONTRACT_SIGNING',           // Подписание договора
  CONTRACTED = 'CONTRACTED',                       // Законтрактовано
  AGREEMENT_RKD = 'AGREEMENT_RKD',                 // Согласование РКД
  MANUFACTURING = 'MANUFACTURING',                 // Изготовление
  DELIVERY = 'DELIVERY',                           // Доставка
  DELIVERED = 'DELIVERED',                         // Поставлено
  PAID = 'PAID',                                   // Оплачено
  COMPLETED = 'COMPLETED',                         // Завершено
}

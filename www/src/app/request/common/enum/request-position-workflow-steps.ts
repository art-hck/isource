import { RequestPosition } from "../models/request-position";

export enum RequestPositionWorkflowSteps {
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

export const RequestPositionWorkflowStepsGroups = {
  DRAFT: [
    RequestPositionWorkflowSteps.DRAFT,
    RequestPositionWorkflowSteps.ON_CUSTOMER_APPROVAL
  ],
  NEW: [
    RequestPositionWorkflowSteps.NEW
  ],
  TECHNICAL_PROPOSALS: [
    RequestPositionWorkflowSteps.TECHNICAL_PROPOSALS_PREPARATION,
    RequestPositionWorkflowSteps.TECHNICAL_PROPOSALS_AGREEMENT
  ],
  PROPOSALS: [
    RequestPositionWorkflowSteps.PROPOSALS_PREPARATION,
    RequestPositionWorkflowSteps.WINNER_SELECTED,
    RequestPositionWorkflowSteps.RESULTS_AGREEMENT,
  ],
  CONTRACT: [
    RequestPositionWorkflowSteps.CONTRACTED,
    RequestPositionWorkflowSteps.CONTRACT_SIGNING,
    RequestPositionWorkflowSteps.CONTRACT_AGREEMENT
  ],
  RKD: [
    RequestPositionWorkflowSteps.RKD_AGREEMENT,
    RequestPositionWorkflowSteps.MANUFACTURING
  ],
  DELIVERY: [
    RequestPositionWorkflowSteps.DELIVERY,
    RequestPositionWorkflowSteps.DELIVERED
  ],
  COMPLETED: [
    RequestPositionWorkflowSteps.PAID,
    RequestPositionWorkflowSteps.COMPLETED
  ],
};

export const RequestPositionWorkflowStepsGroupsInfo: RequestPositionWorkflowStepGroupInfo[] = [
  {
    url: "draft",
    label: "Черновик",
    statuses: RequestPositionWorkflowStepsGroups.DRAFT,
    positions: [],
    shortName: "Черновик",
    hasActions: false
  },
  {
    url: "new",
    label: "Новая",
    statuses: RequestPositionWorkflowStepsGroups.NEW,
    positions: [],
    shortName: "Новая",
    hasActions: false,
    color: "#EB5757"
  },
  {
    url: "technical-proposals",
    label: "Технические предложения",
    statuses: RequestPositionWorkflowStepsGroups.TECHNICAL_PROPOSALS,
    positions: [],
    shortName: "ТП",
    hasActions: true,
    color: "#fb6a9e"
  },
  {
    url: "commercial-proposals",
    label: "Коммерческие предложения",
    statuses: RequestPositionWorkflowStepsGroups.PROPOSALS,
    positions: [],
    shortName: "КП",
    hasActions: true,
    color: "#f38b00"
  },
  {
    url: "design-documentation",
    label: "РКД",
    statuses: RequestPositionWorkflowStepsGroups.RKD,
    positions: [],
    shortName: "РКД и изготовление",
    hasActions: true,
    color: "#56b9f2"
  },
  {
    url: "contract",
    label: "Договор",
    statuses: RequestPositionWorkflowStepsGroups.CONTRACT,
    positions: [],
    shortName: "Договор",
    hasActions: true,
    color: "#f2c94c"
  },
  {
    url: "delivery",
    label: "Доставка и оплата",
    statuses: RequestPositionWorkflowStepsGroups.DELIVERY,
    positions: [],
    shortName: "Доставка и оплата",
    hasActions: false,
    color: "#9b51e0"
  },
  {
    url: "completed",
    label: "Завершено",
    statuses: RequestPositionWorkflowStepsGroups.COMPLETED,
    positions: [],
    shortName: "Завершено",
    hasActions: false,
    color: "#20b55f"
  },
];

export interface RequestPositionWorkflowStepGroupInfo {
  url: string;
  label: string;
  statuses: RequestPositionWorkflowSteps[];
  positions: RequestPosition[];
  shortName: string;
  hasActions: boolean;
  color?: string;
}

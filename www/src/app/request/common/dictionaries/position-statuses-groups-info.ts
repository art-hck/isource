import { RequestPosition } from "../models/request-position";
import { PositionStatusGroups } from "./position-statuses-groups";
import { PositionStatus } from "../enum/position-status";

export interface PositionStatusesGroupInfo {
  url: string;
  label: string;
  statuses: PositionStatus[];
  positions: RequestPosition[];
  shortName: string;
  hasActions: boolean;
  color?: string;
}

export const PositionStatusesGroupsInfo: PositionStatusesGroupInfo[] = [
  {
    url: "draft",
    label: "Черновик",
    statuses: PositionStatusGroups.DRAFT,
    positions: [],
    shortName: "Черновик",
    hasActions: false,
    color: "#b3b3b3"
  },
  {
    url: "new",
    label: "Новая",
    statuses: PositionStatusGroups.NEW,
    positions: [],
    shortName: "Новая",
    hasActions: false,
    color: "#EB5757"
  },
  {
    url: "technical-proposals",
    label: "Технические предложения",
    statuses: PositionStatusGroups.TECHNICAL_PROPOSALS,
    positions: [],
    shortName: "ТП",
    hasActions: true,
    color: "#fb6a9e"
  },
  {
    url: "commercial-proposals",
    label: "Коммерческие предложения",
    statuses: PositionStatusGroups.PROPOSALS,
    positions: [],
    shortName: "КП",
    hasActions: true,
    color: "#f38b00"
  },
  {
    url: "technical-commercial-proposals",
    label: "Технико-коммерческие предложения",
    statuses: PositionStatusGroups.TECHNICAL_COMMERCIAL_PROPOSALS,
    positions: [],
    shortName: "ТКП",
    hasActions: true,
    color: "#EE64E8"
  },
  {
    url: "design-documentation",
    label: "РКД",
    statuses: PositionStatusGroups.RKD,
    positions: [],
    shortName: "РКД и изготовление",
    hasActions: true,
    color: "#56b9f2"
  },
  {
    url: "contracts",
    label: "Договор",
    statuses: PositionStatusGroups.CONTRACT,
    positions: [],
    shortName: "Договор",
    hasActions: true,
    color: "#f2c94c"
  },
  {
    url: "delivery",
    label: "Доставка и оплата",
    statuses: PositionStatusGroups.DELIVERY,
    positions: [],
    shortName: "Доставка и оплата",
    hasActions: false,
    color: "#9b51e0"
  },
  {
    url: "completed",
    label: "Завершено",
    statuses: PositionStatusGroups.COMPLETED,
    positions: [],
    shortName: "Завершено",
    hasActions: false,
    color: "#20b55f"
  },
];



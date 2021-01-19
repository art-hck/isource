import { Uuid } from "../../../cart/models/uuid";

export class DashboardAvailableFilters {
  requests: DashboardAvailableFiltersRequestItem[];
  customers: DashboardAvailableFiltersCustomerItem[];
  responsibleUsers: DashboardAvailableFiltersResponsibleUserItem[];
  totalCount: number;
}

export class DashboardAvailableFiltersRequestItem {
  id: Uuid;
  number: number;
  name: string;
  customerName: string;
  positionsCount: number;
  asapDeliveryDatePositionsCount: number;
  minDeliveryDate: string;
  maxDeliveryDate: string;
}

export class DashboardAvailableFiltersCustomerItem {
  id: Uuid;
  contragentName: string;
  kpp: number;
  inn: number;
  groupName: string;
}

export class DashboardAvailableFiltersResponsibleUserItem {
  id: Uuid;
  fullName: string;
  email: string;
  phone: string;
  groupName: string;
}

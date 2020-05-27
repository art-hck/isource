import { RequestStatusCount } from "../../request/common/models/requests-list/request-status-count";

export class Page<T> {
  totalCount: number;
  statusCounters: RequestStatusCount;
  entities: Array<T>;

  constructor(entities: Array<T>, totalCount: number, statusCounters: RequestStatusCount) {
    this.totalCount = totalCount;
    this.statusCounters = statusCounters;
    this.entities = entities;
  }
}

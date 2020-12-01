export namespace DashboardActions {
  export class FetchStatusesStatistics {
    static readonly type = '[Dashboard Backoffice] FetchStatusesStatistics';

    constructor(public filters: any) {}
  }
}

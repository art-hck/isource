export namespace DashboardActions {
  export class FetchTasks {
    static readonly type = '[Dashboard Backoffice] FetchTasks';
    constructor() {}
  }

  export class FetchAgreements {
    static readonly type = '[Dashboard Backoffice] FetchAgreements';
    constructor() {}
  }

  export class FetchStatusesStatistics {
    static readonly type = '[Dashboard Backoffice] FetchStatusesStatistics';

    constructor(public filters: any) {}
  }
}

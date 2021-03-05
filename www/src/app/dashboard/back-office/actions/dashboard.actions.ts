export namespace DashboardActions {
  export class FetchTasks {
    static readonly type = '[Dashboard Backoffice] FetchTasks';
    constructor() {}
  }

  export class FetchAgreements {
    static readonly type = '[Dashboard Backoffice] FetchAgreements';
    constructor() {}
  }

  export class FetchProcedures {
    static readonly type = '[Dashboard Backoffice] FetchProcedures';
    constructor(public filters: any) {}
  }

  export class FetchStatusesStatistics {
    static readonly type = '[Dashboard Backoffice] FetchStatusesStatistics';

    constructor(public filters: any) {}
  }

  export class FetchAvailableFilters {
    static readonly type = '[Dashboard Backoffice] FetchAvailableFilters';

    constructor(public filters: any) {}
  }
}

export namespace ItemsDictionaryActions {
  export class Search {
    static readonly type = '[Kim Customer ItemsDictionary] Search';
    constructor(public query: string) {}
  }

  export class Clear {
    static readonly type = '[Kim Customer ItemsDictionary] Clear';
  }
}

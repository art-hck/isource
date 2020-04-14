export namespace ItemsDictionaryActions {
  export class Search {
    static readonly type = '[Kim Customer ItemsDictionary] Search';
    constructor(public name: string) {}
  }

  export class Clear {
    static readonly type = '[Kim Customer ItemsDictionary] Clear';
  }
}

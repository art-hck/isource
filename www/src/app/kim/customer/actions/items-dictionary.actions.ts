import { KimDictionaryItem } from "../../common/models/kim-dictionary-item";

export namespace ItemsDictionaryActions {
  export class Search {
    static readonly type = '[Kim Customer ItemsDictionary] Search';
    constructor(public name: string) {}
  }

  export class Clear {
    static readonly type = '[Kim Customer ItemsDictionary] Clear';
  }

  export class AddItem {
    static readonly type = '[Kim Customer ItemsDictionary] AddItem';
    constructor(public item: KimDictionaryItem) {}
  }
}

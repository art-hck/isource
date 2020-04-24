import { KimDictionaryItem } from "../../common/models/kim-dictionary-item";

export namespace CartActions {
  export class Fetch {
    static readonly type = '[Kim Customer Cart] Fetch';
  }

  export class AddItem {
    static readonly type = '[Kim Customer ItemsDictionary] AddItem';
    constructor(public item: KimDictionaryItem, public quantity: number) {}
  }
}

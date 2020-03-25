import { Toast } from "../models/toast";

export namespace ToastActions {
  export class Push {
    static readonly type = '[Toast] Push';
    constructor(public toast: Toast) {
    }
  }

  export class Remove {
    static readonly type = '[Toast] Remove';
    constructor(public toast: Toast) {}
  }

  export class Hold {
    static readonly type = '[Toast] Hold';
    constructor(public toast: Toast) {}
  }

  export class Release {
    static readonly type = '[Toast] Release';
    constructor(public toast: Toast) {}
  }
}

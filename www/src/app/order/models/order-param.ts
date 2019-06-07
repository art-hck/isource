import {ParamType} from "../enums/param-types";
import {formatSum} from "../../core/utils/number";
import {formatStrDate} from "../../core/utils/date";

export class OrderParam {
  name: string;
  type: string;
  values: any;

  constructor(params?: Partial<OrderParam>) {
    Object.assign(this, params);
  }

  getRepresentation(): string {
    if (this.type === ParamType.DATETIME) {
      return formatStrDate(this.values);
    }

    if (this.type === ParamType.STRING) {
      return this.values;
    }

    if (this.type === ParamType.FLOAT) {
      return formatSum(this.values);
    }

    return '';
  }
}

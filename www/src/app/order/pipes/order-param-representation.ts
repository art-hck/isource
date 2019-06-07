import {Pipe, PipeTransform} from "@angular/core";
import {OrderParam} from "../models/order-param";
import {getOrderParamRepresentation} from "../utils/format";


@Pipe({name: 'orderParamRepresentation'})
export class OrderParamRepresentation implements PipeTransform {
  transform(orderParam?: OrderParam): any {
    if (!orderParam) {
      return '';
    }

    return getOrderParamRepresentation(orderParam);
  }
}

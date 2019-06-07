import {formatSum} from "../../core/utils/number";
import {ParamType} from "../enums/param-types";
import {formatStrDate} from "../../core/utils/date";
import {OrderParam} from "../models/order-param";

export function getOrderParamRepresentation(orderParam: OrderParam): string {
  if (orderParam.type === ParamType.DATETIME) {
    return formatStrDate(orderParam.values);
  }

  if (orderParam.type === ParamType.STRING) {
    return orderParam.values;
  }

  if (orderParam.type === ParamType.FLOAT) {
    return formatSum(orderParam.values);
  }

  return '';
}

export function getPositionsCountRepresentation(positionsCount: number): string {
  if (positionsCount >= 10 && positionsCount <= 19) {
    return positionsCount + ' позиций';
  }

  const rem = positionsCount % 10;

  if (rem === 1) {
    return positionsCount + ' позиция';
  }

  if (rem >= 2 && rem <= 4) {
    return positionsCount + ' позиции';
  }

  return positionsCount + ' позиций';
}

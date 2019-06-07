import {Uuid} from "../../cart/models/uuid";
import {OrderParam} from "./order-param";
import {ParamName} from "../enums/param-names";
import {OrderWorkflowStep} from "./order-workflow-step";
import {OrderSupplier} from "./order-supplier";
import {OrderCustomer} from "./order-customer";
import {OrderStatus} from "../enums/order-statuses";
import { ParamType } from "../enums/param-types";
import { OrderCost } from "./order-cost";

export class Order {
  id: Uuid;
  number: string;
  positionsCostWithVat: number;
  totalCost: number;
  positionsCount: number;
  supplier: OrderSupplier;
  customer: OrderCustomer;
  creationDate: string; // todo maybe date type?
  filesCount: number;
  currentStatus: OrderWorkflowStep;
  params: OrderParam[];

  constructor(params?: Partial<Order>) {
    Object.assign(this, params);

    if (params.customer) {
      this.customer = new OrderCustomer(params.customer);
    }

    this.filesCount = 15; // todo load from server
  }

  get deliveryDate(): OrderParam {
    return this.findParam(ParamName.DELIVERY_DATE);
  }

  get deliveryAddress(): OrderParam {
    return this.findParam(ParamName.DELIVERY_ADDRESS);
  }

  get deliveryCost(): OrderParam {
    return this.findParam(ParamName.DELIVERY_COST);
  }

  get deliveryCostValue(): number {
    const deliveryParam = this.deliveryCost;

    return deliveryParam ?
      deliveryParam.values :
      undefined;
  }

  set deliveryCostValue(value) {
    this.setOrCreateParam(ParamName.DELIVERY_COST, ParamType.FLOAT, +value);
  }

  get isFreeDelivery() {
    return this.deliveryCostValue === 0;
  }

  get orderAdditionalInfo(): OrderParam {
    return this.findParam(ParamName.ORDER_ADDITIONAL_INFO);
  }

  get supplierResponseDate(): OrderParam {
    return this.findParam(ParamName.SUPPLIER_RESPONSE_DATE);
  }

  get supplierName(): string {
    return this.supplier ? this.supplier.name : '';
  }
  get customerName(): string {
    return this.customer ? this.customer.name : '';
  }

  get statusLabel() {
    return this.currentStatus ? this.currentStatus.label : '';
  }

  isWaitingForSupplierResponse(): boolean {
    const status = this.currentStatus ? this.currentStatus.type : null;
    return status === OrderStatus.WAIT_FOR_SUPPLIER_CONFIRM;
  }

  isWaitingForCustomerConfirm(): boolean {
    const status = this.currentStatus ? this.currentStatus.type : null;
    return status === OrderStatus.WAIT_FOR_CUSTOMER_CONFIRM;
  }

  protected findParam(paramName): OrderParam {
    return this.params.find((param: OrderParam) => param.name === paramName);
  }

  /**
   * Устанавливает значение параметру заказа.
   * Если параметра еще нет, то создает его.
   *
   * todo Наверное плохо создавать параметры на фронтэнде, потом требуется перенести создание на бекэнд
   *
   * @param paramName
   * @param paramType
   * @param value
   */
  protected setOrCreateParam(paramName: string, paramType: string, value: any): void {
    // ищем существующий параметр стоимости доставки
    const orderParam = this.findParam(paramName);

    if (orderParam) {
      orderParam.values = value;
      return;
    }

    //  если не нашли, то создаем новый
    this.params.push(new OrderParam({
      name: paramName,
      type: paramType,
      values: value
    }));
  }

  /**
   * Назначает заказу новую стоимость
   * @param orderCost
   */
  public setOrderCost(orderCost: OrderCost): void {
    this.totalCost = orderCost.totalCost;
    this.positionsCostWithVat = orderCost.positionsCostWithVat;
    this.setParam(orderCost.deliveryCostParam);
  }

  /**
   * Устанавливает параметр к заказу.
   * Если параметра у заказа не было, то он добавится. Если был то будет перезаписано значение.
   * @param param
   */
  public setParam(param: OrderParam) {
    const foundParam = this.findParam(param.name);

    if (param) {
      foundParam.values = param.values;
    } else {
      this.params.push(param);
    }
  }
}

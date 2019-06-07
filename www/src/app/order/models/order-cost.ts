import { OrderParam } from "./order-param";

/**
 * Вспомогательный класс для получения данных о финансовой информации заказа
 */
export class OrderCost {
  positionsCostWithVat: number;
  totalCost: number;
  deliveryCostParam: OrderParam;

  constructor(params?: Partial<OrderCost>) {
    Object.assign(this, params);
  }
}

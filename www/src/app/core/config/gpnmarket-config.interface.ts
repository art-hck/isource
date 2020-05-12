import { FeatureList } from "./feature-list";
import { InjectionToken } from "@angular/core";

export const APP_CONFIG = new InjectionToken<GpnmarketConfigInterface>('app.config');

/**
 * Интерфейс главного конфига приложения
 */
export interface GpnmarketConfigInterface {
  clientId: string;
  endpoints: {
    api: string,
    // адрес WebSocket сервера
    ws: string
  };
  dadata: {
    apiKey: string
  };
  paginator: {
    pageSize: number
  };
  procedure: {
    url: string
    resultUrl: string
  };
  priceOrder: {
    url: string
  };
  instructions: {
    forCustomer: string,
    forBackoffice: string
  };
  disabledFeatures: Array<keyof typeof FeatureList>;
}

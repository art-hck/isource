import { FeatureList } from "./feature-list";
import { InjectionToken } from "@angular/core";
import * as Sentry from "@sentry/browser";
import { KeycloakOptions } from "keycloak-angular";

export const APP_CONFIG = new InjectionToken<GpnmarketConfigInterface>('app.config');

/**
 * Интерфейс главного конфига приложения
 */
export interface GpnmarketConfigInterface {
  clientId: string;
  endpoints: {
    api: string,
    ws: string,
    wsChat: string
  };
  keycloak: KeycloakOptions;
  dadata: {
    apiKey: string
  };
  sentry: {
    enabled: boolean,
    dsn: string,
    environment: string,
    // fatal, error, warning, info, debug
    level: Sentry.Severity
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

import { FeatureList } from "./feature-list";
import { InjectionToken } from "@angular/core";
import * as Sentry from "@sentry/browser";
import { KeycloakOptions } from "keycloak-angular";
import { AppFileExtensions } from "../../shared/components/file/file";
import { MenuModel } from "../models/menu.model";

export const APP_CONFIG = new InjectionToken<GpnmarketConfigInterface>('app.config');

/**
 * Интерфейс главного конфига приложения
 */
export interface GpnmarketConfigInterface {
  clientId: string;
  endpoints: {
    api: string,
    ws: string,
    apiChat: string,
    wsChat: string
  };
  files: {
    allowedExtensions: AppFileExtensions,
    deniedExtensions: AppFileExtensions
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
  profile: {
    url: string
  };
  intelplan: {
    url: string;
  };
  notifications: {
    url: string;
  };
  instructions: {
    forCustomer: string,
    forBackoffice: string
  };
  menu: {
    additionalItems: MenuModel[]
  };
  disabledFeatures: Array<keyof typeof FeatureList>;
  metrika: { id: string | null, options: any };
  ga: { id: string | null };
}

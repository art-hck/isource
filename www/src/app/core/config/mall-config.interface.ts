import { AppConfigInterface } from 'stdlib-ng/dist/core';

/**
 * Интерфейс главного конфига приложения
 */
export interface MallConfigInterface extends AppConfigInterface {
  clientId: string;
  endpoints: {
    hub: string,
    hubApi: string,
    itemsdictionary: string,
    itemsdictionaryApi: string,
    api: string,
    nsi: string,
    availableGui: string
  };
}

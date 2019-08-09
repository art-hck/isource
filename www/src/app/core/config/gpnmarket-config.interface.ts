/**
 * Интерфейс главного конфига приложения
 */
export interface GpnmarketConfigInterface {
  clientId: string;
  endpoints: {
    api: string
  };
  dadata: {
    apiKey: string
  };
}

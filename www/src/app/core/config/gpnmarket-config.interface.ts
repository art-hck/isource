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
}

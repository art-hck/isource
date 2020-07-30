export interface WsConfig {
  url: string;
  chatUrl: string;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

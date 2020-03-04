import { LatLngExpression } from "leaflet";

export interface DashboardMapMarkerItem {
  progress: string;
  address: string;
  title: string;
  coords?: LatLngExpression;
  contragents?: {
    coords?: LatLngExpression;
    address: string;
  }[];
}

import { LatLngExpression } from "leaflet";
import { Observable } from "rxjs";

export interface DashboardMapMarkerData {
  title: string;
  address: string;
  progress: number;
  coords$?: Observable<LatLngExpression>;
  contragents?: {
    coords$?: Observable<LatLngExpression>;
    address: string;
  }[];
}

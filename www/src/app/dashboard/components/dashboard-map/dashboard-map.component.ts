import * as L from 'leaflet';
import { LatLngExpression, Map, Marker } from 'leaflet';
import 'leaflet.markercluster';
import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { ClarityIcons } from "@clr/icons";
import { catchError, filter, flatMap, map, toArray } from "rxjs/operators";
import { DashboardMapService } from "../../services/dashboard-map.service";
import { DashboardService } from "../../services/dashboard.service";
import { EMPTY, from, Observable, of, throwError } from "rxjs";
import { DashboardMapMarkerItem } from "../../models/dashboard-map-marker-item";
import { DashboardMapBasisMock } from "./dashboard-map-basis.mock";

ClarityIcons.add({ "map-basis": `<svg viewBox="0 0 72 84" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M54 0H66L69 58H72V84H48H24H0V58L22 36H24V58L46 36H48V58H51L54 0ZM18 65V61H6V65H18ZM6 71V67H18V71H6ZM42 67H30V71H42V67ZM30 61H42V65H30V61Z"/></svg>` });
ClarityIcons.add({ "map-contragent": `<svg viewBox="0 0 27 37" xmlns="http://www.w3.org/2000/svg"><path d="M27 13.2995C27 20.6447 13.5 37 13.5 37C13.5 37 -1.80481e-06 20.6447 -1.16268e-06 13.2995C-5.20551e-07 5.95441 6.04416 5.28397e-07 13.5 1.18021e-06C20.9558 1.83202e-06 27 5.95441 27 13.2995Z"/></svg>` });
ClarityIcons.add({ "map-jiber-bus": `<svg width="44" height="44" viewBox="0 0 39 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d)">
<path d="M35 15.5C35 20.4807 32.6508 24.9126 29 27.7484C28.0775 28.4649 23.5718 32.5042 22.5 33C22.5 30.3722 21.8212 31 19.5 31C18.8223 31 18.1547 30.9565 17.5 30.8722C16.6428 30.7617 15.8074 30.5813 15 30.3367C8.63415 28.4085 4 22.4954 4 15.5C4 6.93959 10.9396 0 19.5 0C28.0604 0 35 6.93959 35 15.5Z" fill="white"/>
</g>
<path d="M26.1889 9.64588C26.0462 8.12923 25.8188 6.94835 25.4591 6.48419C23.9758 4.57572 13.5859 4.43605 12.4063 6.48419C12.1177 6.98598 11.9153 8.16268 11.7795 9.64839C11.3413 9.70443 11 10.1054 11 10.5964V12.4542C11 12.8674 11.2409 13.2157 11.5771 13.3516C11.4975 16.2779 11.5621 19.3308 11.6814 20.8492C11.6814 22.0213 12.4059 21.8268 12.4059 21.8268H13.085V23.0922C13.085 23.594 13.5609 24 14.1473 24C14.7344 24 15.2104 23.594 15.2104 23.0922V21.8268H23.1109V23.0922C23.1109 23.594 23.5865 24 24.1736 24C24.76 24 25.2359 23.594 25.2359 23.0922V21.8268H25.4591C25.4591 21.8268 26.3117 21.954 26.3663 21.402C26.3663 19.8878 26.454 16.5321 26.3817 13.3646C26.7391 13.2429 27 12.8849 27 12.4542V10.5964C27.0004 10.0937 26.6426 9.68603 26.1889 9.64588ZM14.9437 6.75641H22.9216V8.06817H14.9437V6.75641ZM15.0576 18.9756C14.4312 18.9756 13.9237 18.4236 13.9237 17.7429C13.9237 17.0625 14.4312 16.511 15.0576 16.511C15.684 16.511 16.1919 17.0625 16.1919 17.7429C16.1919 18.4236 15.6844 18.9756 15.0576 18.9756ZM22.8789 18.9756C22.2529 18.9756 21.7443 18.4236 21.7443 17.7429C21.7443 17.0625 22.2525 16.511 22.8789 16.511C23.5053 16.511 24.0128 17.0625 24.0128 17.7429C24.0132 18.4236 23.5053 18.9756 22.8789 18.9756ZM24.3206 14.9385H13.5448V8.79577H24.3206V14.9385Z" fill="#01325D"/>
<circle cx="20" cy="40" r="4" fill="#01325D"/>
<defs>
<filter id="filter0_d" x="0" y="0" width="39" height="41" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
</filter>
</defs>
</svg>` });

@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['dashboard-map.component.scss']
})
export class DashboardMapComponent implements OnInit {
  map: Map;
  markersGroup = L.markerClusterGroup({ showCoverageOnHover: false });
  markersData$: Observable<DashboardMapMarkerItem[]>;
  noCacheLimit = 5;

  constructor(
    private dashboardMapService: DashboardMapService,
    private dashboardService: DashboardService,
    private viewContainer: ViewContainerRef,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.markersData$ = this.dashboardService.getBasisStatistic().pipe(
      flatMap(data => from(data).pipe(
        flatMap(item => this.getCoords$(item.address).pipe(map(([coords, title]) => ({...item, coords, title: title || item.title})))),
        flatMap(item => from(item.contragents).pipe(
          flatMap(contragent => this.getCoords$(contragent.address).pipe(map(([coords, title]) => ({...contragent, coords, name: title || contragent.name})))),
          toArray(),
          map(contragents => ({...item, contragents}))
        )),
        map(item => {
          item.progress = Math.round(+item.progress).toString();
          return item;
        }),
        toArray()
      ))
    );
  }

  getCoordsFromCache$(address): Observable<[LatLngExpression, string]> {
    const [, coords, title] = DashboardMapBasisMock.find(([_address]) => address.indexOf(_address) !== -1) || [null, null, null];
    if (coords) {
      return of([coords, title]);
    } else {
      return this.noCacheLimit-- > 0 ? throwError("Address not cached") : EMPTY;
    }
  }

  getCoords$(address: string): Observable<[LatLngExpression, string]> {
    return this.getCoordsFromCache$(address).pipe(
      catchError(() => this.dashboardMapService.search(address).pipe(
        filter(foundAddresses => foundAddresses.length > 0),
        map(foundAddresses => [([+foundAddresses[0].lat, +foundAddresses[0].lon]), null] as [LatLngExpression, string]),
      )),
    );
  }

  initMap(m: Map) {
    this.map = m;
    this.map.addLayer(this.markersGroup);
    this.cd.detectChanges();
  }

  addContragentMarker(marker: Marker, lineCoords: LatLngExpression[][]) {
    this.markersGroup.addLayer(marker);

    const line = L.polyline(lineCoords, { weight: 2, opacity: 0.1, color: 'black' });
    this.markersGroup.addLayer(line);

    const icon = L.divIcon({
      className: null,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      html: `<uxg-icon shape="map-jiber-bus" class="dashboard-map-marker-icon" size="44"></uxg-icon>`
    });

    this.markersGroup.addLayer(L.marker(line.getCenter(), { icon }));
  }

  getPointType({ progress }): "succ" | "warn" | "err" {
    switch (true) {
      case progress < 30: return "err";
      case progress < 60: return "warn";
      default: return "succ";
    }
  }
}

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
    this.markersGroup.addLayer(L.polyline(lineCoords, { weight: 2, opacity: 0.1, color: 'black' }));
  }

  getPointType({ progress }): "succ" | "warn" | "err" {
    switch (true) {
      case progress < 30: return "err";
      case progress < 60: return "warn";
      default: return "succ";
    }
  }
}

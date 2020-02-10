import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Map } from 'leaflet';

@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['dashboard-map.component.scss']
})
export class DashboardMapComponent implements AfterViewInit {
  map: Map;
  @ViewChild('mapRef', { static: false }) mapRef: ElementRef;

  ngAfterViewInit() {
    this.map = L.map(this.mapRef.nativeElement, {
      center: [61.586139901184815, 99.4807279788772],
      zoomControl: false,
      scrollWheelZoom: false,
      zoom: 4
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  }
}

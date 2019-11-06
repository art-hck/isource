import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delivery-monitor',
  templateUrl: './delivery-monitor.component.html',
  styleUrls: ['./delivery-monitor.component.scss']
})
export class DeliveryMonitorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getUpdateDate() {
    return "сегодня, 17:00";
  }

  fetchChildren() {
    console.log('trigger');
  }
}

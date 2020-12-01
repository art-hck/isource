import { Component, Input, OnInit } from '@angular/core';
import { StatusesStatisticsInfo } from "../../models/statuses-statistics";

@Component({
  selector: 'app-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss']
})
export class DashboardStatisticsComponent implements OnInit {

  @Input() statusesStatistics: StatusesStatisticsInfo;
  constructor() { }

  ngOnInit(): void {
  }

}

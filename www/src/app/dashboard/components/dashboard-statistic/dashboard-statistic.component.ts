import { Component, OnInit } from '@angular/core';
import { DashboardService } from "../../services/dashboard.service";
import {
  RequestPositionWorkflowSteps,
  RequestPositionWorkflowStepsGroupsInfo
} from "../../../request/common/enum/request-position-workflow-steps";
import { PieChartItem } from "../../../shared/models/pie-chart-item";

@Component({
  selector: 'app-dashboard-statistic',
  templateUrl: './dashboard-statistic.component.html'
})
export class DashboardStatisticComponent implements OnInit {

  pieChartItems: PieChartItem[] = [];

  constructor(
    protected dashboardService: DashboardService
  ) {
  }

  ngOnInit(): void {
    this.dashboardService.getPositionStatusStatistic()
      .subscribe((statistics: Array<{status: string, count: number}>) => {
        const statusCounters = this.getStatusCounters(statistics);

        this.pieChartItems = statusCounters.map((counter) => {
          const countStatistic =  counter.statistics.reduce((sum, item) => sum + item.count, 0);
          return new PieChartItem({
            count: countStatistic,
            label: counter.label,
            color: counter.color
          });
        });
      });
  }

  private getStatusCounters(statistics: Array<{status: string, count: number}>) {
    return RequestPositionWorkflowStepsGroupsInfo
      .filter(statusCounter => statusCounter.color)
      .map(statusCounter => ({
        ...statusCounter,
        statistics: statistics.filter((statistic) => {
          return statusCounter.statuses.indexOf(<RequestPositionWorkflowSteps> statistic.status) >= 0;
        })
      }));
  }
}

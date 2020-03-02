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

  statusStatisticPieChartItems: PieChartItem[] = [];
  pricesStatisticPieChartItems: PieChartItem[] = [];

  constructor(
    protected dashboardService: DashboardService
  ) {
  }

  ngOnInit(): void {
    this.dashboardService.getPositionStatusStatistic()
      .subscribe((statistics: Array<{ status: string, count: number }>) => {
        const statusCounters = this.getStatusCounters(statistics);

        this.statusStatisticPieChartItems = this.prepareStatistic(statusCounters);
      });

    this.dashboardService.getPositionMoneyStatistic()
      .subscribe((statistics: Array<{ status: string, price: number }>) => {
        // немного меняем формат, чтобы передать в функцию подстчета в группах статусов
        const prepareStatistic = statistics.map(item => {
          return {status: item.status, count: +item.price};
        });
        const statusCounters = this.getStatusCounters(prepareStatistic);

        this.pricesStatisticPieChartItems = this.prepareStatistic(statusCounters);
      });
  }

  /**
   * Считает статистику по группам статусов.
   * @param statistics
   */
  private getStatusCounters(
    statistics: Array<{ status: string, count: number }>
  ) {
    return RequestPositionWorkflowStepsGroupsInfo
      .filter(statusCounter => statusCounter.color)
      .filter(statusCounter => {
        // выбираем только те группы статусов, по которым пришел хоть один статус из статистики
        return statusCounter.statuses.some(counterStatus => {
          return statistics.some(statisticsStatus => statisticsStatus.status === counterStatus);
        });
      })
      .map(statusCounter => ({
        ...statusCounter,
        statistics: statistics.filter((statistic) => {
          return statusCounter.statuses.indexOf(<RequestPositionWorkflowSteps>statistic.status) >= 0;
        })
      }));
  }

  /**
   * Преобразует данные статистики по группам статусов в элементы диаграммы
   * @param statusCounters
   * @param measure
   */
  private prepareStatistic(statusCounters, measure: string = '') {
      return statusCounters.map((counter) => {
      const countStatistic = counter.statistics.reduce((sum, item) => sum + item.count, 0);
      return new PieChartItem({
        count: countStatistic,
        label: counter.label + measure,
        color: counter.color
      });
    });
  }
}

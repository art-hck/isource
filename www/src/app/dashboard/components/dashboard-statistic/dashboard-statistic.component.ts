import { Component, OnInit } from '@angular/core';
import { DashboardService } from "../../services/dashboard.service";
import { PositionStatus } from "../../../request/common/enum/position-status";
import { PieChartItem } from "../../../shared/models/pie-chart-item";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { PositionStatusesGroupsInfo } from "../../../request/common/dictionaries/position-statuses-groups-info";

@Component({
  selector: 'app-dashboard-statistic',
  templateUrl: './dashboard-statistic.component.html'
})
export class DashboardStatisticComponent implements OnInit {
  statusStatisticPieChartItems$: Observable<PieChartItem[]>;
  pricesStatisticPieChartItems$: Observable<PieChartItem[]>;

  constructor(
    protected dashboardService: DashboardService
  ) {
  }

  ngOnInit(): void {
    this.statusStatisticPieChartItems$ = this.dashboardService.getPositionStatusStatistic()
      .pipe(
        map((statistics: Array<{ status: string, count: number }>) => {
            const statusCounters = this.getStatusCounters(statistics);

            return this.prepareStatistic(statusCounters);
          }
        )
      );

    this.pricesStatisticPieChartItems$ = this.dashboardService.getPositionMoneyStatistic()
      .pipe(
        map((statistics: Array<{ status: string, price: number }>) => {
            // немного меняем формат, чтобы передать в функцию подстчета в группах статусов
            const prepareStatistic = statistics.map(item => {
              return {status: item.status, count: +item.price};
            });
            let statusCounters = this.getStatusCounters(prepareStatistic);

            // Не показываем в статистике по деньга статусы Отклонено и Не актуально
            // Фильтруем по урлу потому что группы статусов не типизированы
            statusCounters = statusCounters.filter(statusCounter =>
              !['canceled', 'not-relevant'].includes(statusCounter.url)
            );

            return this.prepareStatistic(statusCounters);
          }
        )
      );
  }

  /**
   * Считает статистику по группам статусов.
   * @param statistics
   */
  private getStatusCounters(
    statistics: Array<{ status: string, count: number }>
  ) {
    return PositionStatusesGroupsInfo
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
          return statusCounter.statuses.indexOf(<PositionStatus>statistic.status) >= 0;
        })
      }));
  }

  /**
   * Преобразует данные статистики по группам статусов в элементы диаграммы
   * @param statusCounters
   * @param measure
   */
  private prepareStatistic(statusCounters, measure: string = ''): PieChartItem[] {
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

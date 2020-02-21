import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RequestPosition } from "../../../models/request-position";
import { RequestPositionWorkflowStepGroupInfo, RequestPositionWorkflowStepsGroupsInfo } from "../../../enum/request-position-workflow-steps";

@Component({
  selector: 'app-request-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input() positions: RequestPosition[];
  @ViewChild('chart', {static: true}) chart: ElementRef;
  statusCounters: RequestPositionWorkflowStepGroupInfo[];

  ngOnInit() {
    this.statusCounters = this.getStatusCounters(this.positions);
    const cx = this.chart.nativeElement.getContext('2d');
    const R = 50; // Радиус
    const total = this.statusCounters.reduce(
      (sum, statusCounter) => sum + statusCounter.positions.length, 0
    );

    cx.canvas.width = R * 2;
    cx.canvas.height = R * 2;

    let  currentAngle = -0.5 * Math.PI;
    this.statusCounters.forEach(statusCounter => {
      const nextAngle = currentAngle + (statusCounter.positions.length / total) * 2 * Math.PI;
      cx.beginPath();
      cx.arc(R, R, R, currentAngle, nextAngle);
      currentAngle = nextAngle;
      cx.lineTo(R, R);
      cx.fillStyle = statusCounter.color;
      cx.fill();
    });
  }

  private getStatusCounters(positions: RequestPosition[]) {
    return RequestPositionWorkflowStepsGroupsInfo
      .filter(statusCounter => statusCounter.color)
      .map(statusCounter => ({
        ...statusCounter,
        positions: positions.filter(position => statusCounter.statuses.indexOf(position.status) >= 0)
      }));
  }
}

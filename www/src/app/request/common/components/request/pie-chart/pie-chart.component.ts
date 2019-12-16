import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RequestPosition } from "../../../models/request-position";
import { RequestPositionWorkflowStepsGroupsInfo } from "../../../enum/request-position-workflow-steps";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent {

  @Input() positions: RequestPosition[];
  @ViewChild('canvas', {static: true}) canvas: ElementRef;

  radius = 50;
  positionsCounterDegrees = [];

  getStatusCounters(positions: RequestPosition[]) {
    const cx = this.canvas.nativeElement.getContext('2d');
    return RequestPositionWorkflowStepsGroupsInfo
      .map(statusCounter => ({
        ...statusCounter,
        positions: positions.filter(position => statusCounter.statuses.indexOf(position.status) >= 0)
      }))
      .map((statusCounter, index) => {
        this.positionsCounterDegrees[index] = statusCounter.positions.length / this.positions.length * 360;
        this.drawSegment(cx, index, statusCounter.color);
        return statusCounter;
      });
  }

  drawSegment(context, i, color) {

    const radius = this.radius;

    const startingAngle = this.degreesToRadians(this.sumTo(this.positionsCounterDegrees, i));
    const arcSize = this.degreesToRadians(this.positionsCounterDegrees[i]);

    context.beginPath();
    context.moveTo(radius, radius);
    context.arc(radius, radius, radius, startingAngle, startingAngle + arcSize);
    context.closePath();
    context.fillStyle = color;
    context.fill();

    context.restore();
  }

  degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  sumTo(a, i) {
    let sum = 0;
    for (let j = 0; j < i; j++) {
      sum += a[j];
    }
    return sum;
  }
}

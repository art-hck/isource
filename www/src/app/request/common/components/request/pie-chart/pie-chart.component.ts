import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RequestPosition } from "../../../models/request-position";
import { RequestPositionWorkflowStepsGroupsInfo } from "../../../enum/request-position-workflow-steps";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input() positions: RequestPosition[];

  @ViewChild('canvas', {static: true}) canvas: ElementRef;
  cx: CanvasRenderingContext2D;

  colors = [];
  width = 100;
  height = 100;
  centerX: number;
  centerY: number;
  radius: number;
  startingAngle: number;
  arcSize: number;
  endingAngle: number;
  positionsCounterDegrees = [];
  statusCounters: any;

  constructor() {
  }

  ngOnInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    for (let i = 0; i < 8; i++) {
      this.drawSegment(canvasEl, this.cx, i);
    }
  }

  getStatusCounters(positions: RequestPosition[]) {
    this.statusCounters = RequestPositionWorkflowStepsGroupsInfo.map(statusCounter => ({
        ...statusCounter,
        positions: positions.filter(position => statusCounter.statuses.indexOf(position.status) >= 0)
      })
    );
    console.log(this.statusCounters);
    this.statusCounters.forEach((statusCounter) => {
      this.positionsCounterDegrees.push(statusCounter.positions.length / this.positions.length * 360)
    });
    console.log(this.positionsCounterDegrees);
    this.statusCounters.forEach((statusCounter) => {
      this.colors.push(statusCounter.color);
    });
    return this.statusCounters;
  }

  drawSegment(canvas, context, i) {

    this.centerX = Math.floor(this.width / 2);
    this.centerY = Math.floor(this.height / 2);
    this.radius = Math.floor(this.width / 2);

    this.startingAngle = this.degreesToRadians(this.sumTo(this.positionsCounterDegrees, i));
    this.arcSize = this.degreesToRadians(this.positionsCounterDegrees[i]);
    this.endingAngle = this.startingAngle + this.arcSize;

    this.cx.beginPath();
    this.cx.moveTo(this.centerX, this.centerY);
    this.cx.arc(this.centerX, this.centerY, this.radius,
      this.startingAngle, this.endingAngle, false);
    this.cx.closePath();

    this.cx.fillStyle = this.colors[i];
    this.cx.fill();

    this.cx.restore();
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

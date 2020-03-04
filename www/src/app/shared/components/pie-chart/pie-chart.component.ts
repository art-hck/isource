import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { PieChartItem } from "../../models/pie-chart-item";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges {

  @Input() items: PieChartItem[] = [];
  @Input() measure = '';
  @Input() radius = 120;
  @Input() showLabel = true;
  @Input() showTotal = true;

  @ViewChild('chart', {static: true}) chart: ElementRef;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.drawChart();
  }

  drawChart(): void {
    this.items = this.items || [];

    const cx = this.chart.nativeElement.getContext('2d');
    const total = this.items.reduce(
      (sum, item) => sum + item.count, 0
    );

    cx.canvas.width = this.radius * 2;
    cx.canvas.height = this.radius * 2;

    let currentAngle = 1.5 * Math.PI;

    this.items.forEach((item) => {
      const nextAngle = currentAngle + (item.count / total) * 2 * Math.PI;

      cx.beginPath();
      cx.arc(this.radius, this.radius, this.radius, currentAngle, nextAngle);
      cx.lineTo(this.radius, this.radius);
      cx.fillStyle = item.color;
      cx.fill();
      cx.closePath();

      currentAngle = nextAngle;
    });

    // рисуем засереную диаграму, если нет данных
    if (total === 0) {
      cx.beginPath();
      cx.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI);
      cx.fillStyle = '#eee';
      cx.fill();
    }

    cx.beginPath();
    cx.arc(this.radius, this.radius, this.radius - this.radius / 2.5, 0, Math.PI * 2);
    cx.fillStyle = "#fff";
    cx.fill();

    if (this.showTotal) {
      cx.fillStyle = "#aaa";
      cx.textAlign = "center";
      cx.font = "lighter " + Math.round(this.radius / 5) + "px sans-serif";
      cx.fillText("Всего", this.radius, this.radius);
      cx.fillStyle = "#777";
      cx.fillText(String(total) + this.measure, this.radius, this.radius + Math.round(this.radius / 5));
    }
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard-statistic',
  templateUrl: './dashboard-statistic.component.html'
})
export class DashboardStatisticComponent implements OnInit {

  @ViewChild('chart', { static: false }) set chart(el: ElementRef) {
    if (!el) {
      return;
    }

    const statusCounters: [number, string, string][] = [
      [21, "21%", "#FB6A9E"],
      [21, "21%", "#ED9254"],
      [12, "12%", "#56B9F2"],
      [20, "20%", "#9B51E0"],
      [26, "26%", "#20B55F"]
    ];
    const cx = el.nativeElement.getContext('2d');
    const R = 120; // Радиус
    const total = 100;

    cx.canvas.width = R * 2;
    cx.canvas.height = R * 2;

    let currentAngle = 1.5 * Math.PI;

    statusCounters.forEach(([percent, label, color]) => {
      const nextAngle = currentAngle + (percent / total) * 2 * Math.PI;
      const halfAngle = currentAngle + (percent / total / 2) * 2 * Math.PI;
      cx.beginPath();

      cx.arc(R, R, R, currentAngle, nextAngle);
      cx.lineTo(R, R);
      cx.fillStyle = color;
      cx.fill();
      cx.closePath();

      currentAngle = nextAngle;
    });

    cx.beginPath();
    cx.arc(R, R, R - 44, 0, Math.PI * 2);
    cx.fillStyle = "#fff";
    cx.fill();
    cx.closePath();

    cx.beginPath();
    cx.moveTo(R, R);
    cx.lineTo(0, 0);
    cx.stroke();
    cx.closePath();
  }
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-percentage-bar',
  templateUrl: './percentage-bar.component.html',
  styleUrls: ['./percentage-bar.component.scss']
})
export class PercentageBarComponent implements OnInit {

  @Input() percentage: number;
  @Input() count: number;
  @Input() sum: number;

  constructor() { }

  ngOnInit(): void {
  }

}

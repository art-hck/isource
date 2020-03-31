import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './kim-cart.component.html',
  styleUrls: ['./kim-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KimCartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './kim-catalog.component.html',
  styleUrls: ['./kim-catalog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KimCatalogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

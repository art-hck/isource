import { Component, Input, OnInit } from '@angular/core';
import { ContragentList } from "../../models/contragent-list";
import { Observable } from "rxjs";

@Component({
  selector: 'app-contragent-list',
  templateUrl: './contragent-list.component.html',
  styleUrls: ['./contragent-list.component.scss']
})
export class ContragentListComponent implements OnInit {

  @Input() contragents$: Observable<ContragentList[]>;

  constructor() { }

  ngOnInit() {
  }

}

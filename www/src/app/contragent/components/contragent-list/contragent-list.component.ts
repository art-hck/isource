import { Component, Input, OnInit } from '@angular/core';
import { ContragentList } from "../../models/contragent-list";
import { Router } from "@angular/router";

@Component({
  selector: 'app-contragent-list',
  templateUrl: './contragent-list.component.html',
  styleUrls: ['./contragent-list.component.scss']
})
export class ContragentListComponent implements OnInit {

  @Input() searchValue: string;
  @Input() contragents: ContragentList[];

  constructor(
    protected router: Router,
  ) { }

  ngOnInit() {
  }

}

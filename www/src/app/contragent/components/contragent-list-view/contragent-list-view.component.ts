import { Component, OnInit } from '@angular/core';
import { ContragentService } from "../../services/contragent.service";
import { ContragentList } from "../../models/contragent-list";

@Component({
  selector: 'app-contragent-list-view',
  templateUrl: './contragent-list-view.component.html',
  styleUrls: ['./contragent-list-view.component.css']
})
export class ContragentListViewComponent implements OnInit {

  public contragents: ContragentList[];

  constructor(
    protected getContragentService: ContragentService
  ) { }

  ngOnInit() {
    this.getContragentList();
  }

  getContragentList() {
    this.getContragentService.getContragentList().subscribe(
      (data: ContragentList[]) => {
        this.contragents = data;
      });
  }

}

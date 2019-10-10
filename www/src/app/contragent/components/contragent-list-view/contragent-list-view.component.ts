import { Component, OnInit } from '@angular/core';
import { ContragentService } from "../../services/contragent.service";
import { ContragentList } from "../../models/contragent-list";
import { Observable } from "rxjs";

@Component({
  selector: 'app-contragent-list-view',
  templateUrl: './contragent-list-view.component.html',
  styleUrls: ['./contragent-list-view.component.css']
})
export class ContragentListViewComponent implements OnInit {

  contragents$: Observable<ContragentList[]>;

  constructor(
    protected getContragentService: ContragentService
  ) { }

  ngOnInit() {
    this.getContragentList();
  }

  getContragentList(): void {
    this.contragents$ = this.getContragentService.getContragentList();
  }

}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContragentService } from "../../services/contragent.service";
import { ContragentList } from "../../models/contragent-list";
import { Observable } from "rxjs";
import { FeatureService } from "../../../core/services/feature.service";
import { UserInfoService } from "../../../user/service/user-info.service";

@Component({
  selector: 'app-contragent-list-view',
  templateUrl: './contragent-list-view.component.html',
  styleUrls: ['./contragent-list-view.component.css']
})
export class ContragentListViewComponent implements OnInit {

  customerSearchValue = "";
  contragents$: Observable<ContragentList[]>;

  constructor(
    protected getContragentService: ContragentService,
    public featureService: FeatureService,
    public userInfoService: UserInfoService
  ) { }

  ngOnInit() {
    this.getContragentList();
  }

  onCustomerSearchInputChange(value: string): void {
    this.customerSearchValue = value;
  }

  getContragentList(): void {
    this.contragents$ = this.getContragentService.getContragentList();
  }

}

import { Component, OnInit } from '@angular/core';
import { Uuid } from "../../../cart/models/uuid";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ContragentInfo } from "../../models/contragent-info";
import { ContragentService } from "../../services/contragent.service";

@Component({
  selector: 'app-contragent-info-view',
  templateUrl: './contragent-info-view.component.html',
  styleUrls: ['./contragent-info-view.component.scss']
})
export class ContragentInfoViewComponent implements OnInit {

  contragentId: Uuid;
  contragent: Observable<ContragentInfo>;

  constructor(
    private route: ActivatedRoute,
    protected getContragentService: ContragentService
  ) { }

  ngOnInit() {
    this.contragentId = this.route.snapshot.paramMap.get('id');
    this.getContragentInfo(this.contragentId);
  }

  getContragentInfo(contragentId: Uuid): void {
    this.contragent = this.getContragentService.getContragentInfo(contragentId);
  }

}

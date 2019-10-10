import { Component, Input, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { ContragentService } from "../../services/contragent.service";
import { ContragentInfo } from "../../models/contragent-info";
import { Uuid } from "../../../cart/models/uuid";

@Component({
  selector: 'app-contragent-info',
  templateUrl: './contragent-info.component.html',
  styleUrls: ['./contragent-info.component.scss']
})
export class ContragentInfoComponent implements OnInit {

  @Input() contragentId: Uuid;
  @Input() contragent: Observable<ContragentInfo>;

  constructor(
    protected getContragentService: ContragentService
  ) { }

  ngOnInit() {
    this.getContragentInfo(this.contragentId);
  }

  getContragentInfo(id: Uuid): void {
    this.contragent = this.getContragentService.getContragentInfo(id);
  }
}

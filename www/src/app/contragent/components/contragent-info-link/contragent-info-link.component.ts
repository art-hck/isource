import { Component, Input, OnInit } from '@angular/core';
import { Uuid } from "../../../cart/models/uuid";
import { ContragentInfo } from "../../models/contragent-info";
import { ContragentService } from "../../services/contragent.service";

@Component({
  selector: 'app-contragent-info-link',
  templateUrl: './contragent-info-link.component.html',
  styleUrls: ['./contragent-info-link.component.scss']
})
export class ContragentInfoLinkComponent implements OnInit {

  @Input() contragent: ContragentInfo;
  @Input() contragentId: Uuid;
  @Input() contragentName: string;

  contragentInfoModalOpened = false;

  constructor(
    protected getContragentService: ContragentService
  ) { }

  ngOnInit() {
    if (!this.contragentName) {
      this.getContragentName(this.contragentId);
    }
  }

  getContragentName(contragentId: Uuid) {
    const subscription = this.getContragentService
      .getContragentInfo(contragentId)
      .subscribe(contragentInfo => {
        this.contragentName = contragentInfo.shortName;
        subscription.unsubscribe();
      });
  }

  showContragentInfo(event: MouseEvent, contragentId: Uuid): void {
    // При клике не даём открыться ссылке из href, вместо этого показываем модальное окно
    event.preventDefault();

    this.contragentInfoModalOpened = true;

    if (!this.contragent || this.contragentId !== contragentId) {
      this.contragent = null;

      const subscription = this.getContragentService
        .getContragentInfo(contragentId)
        .subscribe(contragentInfo => {
          this.contragent = contragentInfo;
          subscription.unsubscribe();
        });
    }
  }

}

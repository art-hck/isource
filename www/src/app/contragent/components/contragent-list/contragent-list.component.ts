import { Component, Input, OnInit } from '@angular/core';
import { ContragentList } from "../../models/contragent-list";
import { Router } from "@angular/router";
import {Uuid} from "../../../cart/models/uuid";

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
  /**
   * Функция предотвращает открытие карточки сотрудника при клике на его эл. почту
   *
   * @param ev
   * @param email
   */
  mailto(ev, email): void {
    ev.preventDefault();
    ev.stopPropagation();

    window.open('mailto:' + email);
  }

  onRowClick(contragentId: Uuid): void {
    this.router.navigateByUrl(`/contragents/${contragentId}/info`);
  }
}

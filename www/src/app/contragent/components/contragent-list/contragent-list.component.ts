import { Component, Input, OnInit } from '@angular/core';
import { ContragentList } from "../../models/contragent-list";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'app-contragent-list',
  templateUrl: './contragent-list.component.html',
  styleUrls: ['./contragent-list.component.scss']
})
export class ContragentListComponent implements OnInit {

  @Input() contragents$: Observable<ContragentList[]>;

  constructor(
    protected router: Router,
  ) { }

  ngOnInit() {
  }

  showContragentInfo(id) {
    this.router.navigateByUrl(`/contragents/${id}/info`).then(r => {});
  }

}

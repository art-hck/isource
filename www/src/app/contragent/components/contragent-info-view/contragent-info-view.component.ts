import { Component, OnInit } from '@angular/core';
import { Uuid } from "../../../cart/models/uuid";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ContragentInfo } from "../../models/contragent-info";
import { ContragentService } from "../../services/contragent.service";
import { Title } from "@angular/platform-browser";
import { tap } from "rxjs/operators";
import { UxgBreadcrumbsService } from "../../../ux-guidlines/components/uxg-breadcrumbs/uxg-breadcrumbs.service";

@Component({
  selector: 'app-contragent-info-view',
  templateUrl: './contragent-info-view.component.html',
  styleUrls: ['./contragent-info-view.component.scss']
})
export class ContragentInfoViewComponent implements OnInit {

  contragentId: Uuid;
  contragent$: Observable<ContragentInfo>;

  constructor(
    private bc: UxgBreadcrumbsService,
    private title: Title,
    private route: ActivatedRoute,
    protected getContragentService: ContragentService
  ) { }

  ngOnInit() {
    this.contragentId = this.route.snapshot.paramMap.get('id');
    this.getContragentInfo(this.contragentId);
  }

  getContragentInfo(contragentId: Uuid): void {
    this.contragent$ = this.getContragentService.getContragentInfo(contragentId).pipe(
      tap(contragent => {
        this.title.setTitle(contragent.fullName);
        this.bc.breadcrumbs = [
          {label: "Контрагенты", link: "/contragents/list"},
          {label: this.title.getTitle(), link: `/contragents/${contragent.id}/info`}
        ];
      })
    );
  }

}

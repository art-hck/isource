import { Component, OnInit } from '@angular/core';
import { AgreementsService } from "../../../agreements/services/agreements.service";
import { Agreements } from "../../models/Agreements";
import { Observable } from "rxjs";

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  agreements$: Observable<Agreements>;

  constructor(private agreementsService: AgreementsService) {}

  ngOnInit() {
    this.agreements$ = this.agreementsService.getAgreements(0, 5);
  }
}

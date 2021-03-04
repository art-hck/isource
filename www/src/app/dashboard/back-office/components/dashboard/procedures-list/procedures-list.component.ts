import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { getCurrencySymbol } from "@angular/common";
import { Store } from "@ngxs/store";
import { Subject } from "rxjs";
import { Procedure } from "../../../../../request/back-office/models/procedure";
import moment from "moment";

@Component({
  selector: 'app-procedures-list',
  templateUrl: './procedures-list.component.html',
  styleUrls: ['./procedures-list.component.scss']
})
export class ProceduresListComponent implements OnInit, OnDestroy {
  @Input() procedures: Procedure[];
  @Input() proceduresTotalCount: number;
  getCurrencySymbol = getCurrencySymbol;

  destroy$ = new Subject();

  constructor(
    public store: Store
  ) { }

  ngOnInit() {
  }

  getStatusLabel(procedure) {
    const finished = moment(procedure?.dateEndRegistration).isBefore();

    if (finished && !procedure?.offersImported) {
      return 'WAITING_OFFERS_IMPORT';
    } else if (finished && procedure?.offersImported) {
      return 'PROCEDURE_FINISHED';
    } else {
      return 'PROCEDURE_ACTIVE';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

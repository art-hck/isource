import { Component, OnInit, OnDestroy, ViewChildren, QueryList, Input, EventEmitter, Output } from '@angular/core';
import { DashboardView } from "../../models/dashboard-view";
import { Store } from "@ngxs/store";
import { Agreement } from "../../../../agreements/common/models/Agreement";
import { StateStatus } from "../../../../request/common/models/state-status";
import { DashboardTaskItem } from "../../models/dashboard-task-item";
import { Observable, Subject } from "rxjs";
import { UxgPopoverComponent } from "uxg";
import { AgreementActionFilters } from "../../../../agreements/back-office/dictionaries/agreement-action-label";

@Component({
  selector: 'app-dashboard-agreements',
  templateUrl: './dashboard-agreements.component.html',
  styleUrls: ['./dashboard-agreements.component.scss']
})
export class DashboardAgreementsComponent implements OnInit, OnDestroy {
  @Input() agreements: Agreement[];
  @Input() tasks: Agreement[];
  @Input() status: StateStatus;
  @Input() tasksTotalCount: number;
  @Input() agreementsTotalCount: number;
  @Input() agreementsBar: DashboardTaskItem[];
  @Input() tasksBar: DashboardTaskItem[];

  @Output() switchView = new EventEmitter();

  @ViewChildren('viewPopover') viewPopover: QueryList<UxgPopoverComponent>;

  destroy$ = new Subject();
  view: DashboardView = "tasks";

  constructor(
    public store: Store
  ) { }

  ngOnInit() {
    this.onSwitchView(this.view);
  }

  onSwitchView(view: DashboardView) {
    this.switchView.emit(view);
    this.view = view;
    this.viewPopover?.first.hide();
  }

  getQueryParams() {
    return {actions: JSON.stringify(AgreementActionFilters[18].type)};
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

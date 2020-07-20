import { Component, OnInit } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { StateStatus } from "../../../../request/common/models/state-status";
import { AgreementListState } from "../../states/agreement-list.state";
import { AgreementListActions } from "../../actions/agreement-list.actions";
import Fetch = AgreementListActions.Fetch;
import { map } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { Agreement } from "../../../common/models/Agreement";
import { AgreementAction } from "../../../back-office/enum/agreement-action";
import { AgreementActionFilters } from "../../dictionaries/agreement-action-label";
import { AgreementsListFilter } from "../../../common/models/agreements-list/agreements-list-filter";
import moment from "moment";

@Component({
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent implements OnInit {
  @Select(AgreementListState.agreements) agreements$: Observable<Agreement[]>;
  @Select(AgreementListState.status) status$: Observable<StateStatus>;
  @Select(AgreementListState.totalCount) totalCount$: Observable<number>;

  filters: AgreementsListFilter = {};
  filterOpened = false;

  readonly pageSize = 10;
  readonly actions: {type: AgreementAction[], label: string}[] = AgreementActionFilters;
  pages$: Observable<number>;

  form = new FormGroup({
    actions: new FormControl(null)
  });

  get activeFilters() {
    return this.filters && Object.entries(this.filters)
      .filter(([k, v]: [keyof AgreementsListFilter, any]) => {
        return k !== 'actions' && v instanceof Array && v.length > 0 || !(v instanceof Array) && v;
      });
  }

  constructor(
    public store: Store,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.pages$ = this.route.queryParams.pipe(map(params => +params["page"]));
    this.form.valueChanges.subscribe(
      () => {
        this.router.navigate(["."], {relativeTo: this.route, queryParams: null});
        this.filters.actions = this.form.value.actions;
        this.store.dispatch(new Fetch(this.filters, 0, this.pageSize));
      }
    );
  }

  loadPage(page: number) {
    this.store.dispatch(new Fetch(this.filters, (page - 1) * this.pageSize, this.pageSize));
  }

  filterList(filters: AgreementsListFilter) {
    this.filters = filters;

    this.filters.actions = (this.form.get('actions').value?.length > 0) ? this.form.get('actions').value : null;
    this.filters.issuedDateFrom = filters.issuedDateFrom !== '' ? moment(moment(filters.issuedDateFrom, 'DD.MM.YYYY')).format('YYYY-MM-DD') : null;
    this.filters.issuedDateTo = filters.issuedDateTo !== '' ? moment(moment(filters.issuedDateTo, 'DD.MM.YYYY')).format('YYYY-MM-DD') : null;
    this.filters.contragents = filters.contragents.length > 0 ? filters.contragents : null;

    this.store.dispatch(new Fetch(this.filters, 0, this.pageSize));
  }
}

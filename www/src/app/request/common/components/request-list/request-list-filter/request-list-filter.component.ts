import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { RequestsListFilter } from "../../../models/requests-list/requests-list-filter";
import { debounceTime, filter, switchMap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { FilterCustomersComponent } from "./filter-customers/filter-customers.component";
import { AvailableFilters } from "../../../models/requests-list/available-filters";

@Component({
  selector: 'app-request-list-filter',
  templateUrl: './request-list-filter.component.html',
  styleUrls: ['./request-list-filter.component.scss']
})
export class RequestListFilterComponent implements OnInit, OnDestroy {

  @ViewChild(FilterCustomersComponent) filterCustomersComponent: FilterCustomersComponent;
  @Output() filter = new EventEmitter<RequestsListFilter>();
  @Output() showResults = new EventEmitter();
  @Input() backofficeView: boolean;
  @Input() resultsCount: number;
  @Input() availableFilters: AvailableFilters;

  readonly destroy$ = new Subject();

  form: FormGroup;
  formInitialValue: RequestsListFilter = {};

  constructor(private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      requestNameOrNumber: '',
      positionStatuses: [[]],
    });

    if (this.backofficeView) {
      this.form.addControl("onlyOpenTasks", this.fb.control(false));
      this.form.addControl("customers", this.fb.control([[]]));
    } else {
      this.form.addControl("onlyOpenAgreements", this.fb.control(false));
      this.form.addControl("userIds", this.fb.control([[]]));
      this.form.addControl("shipmentDateFrom", this.fb.control(''));
      this.form.addControl("shipmentDateTo", this.fb.control(''));
      this.form.addControl("shipmentDateAsap", this.fb.control(false));
    }

    this.formInitialValue = this.form.value;

    this.route.params.pipe(
      switchMap(() => this.form.valueChanges),
      debounceTime(300),
      filter(() => this.form.valid),
      takeUntil(this.destroy$)
    ).subscribe(() => this.filter.emit(this.form.value));
  }

  resetFilter(emitEvent = true) {
    this.form.reset(this.formInitialValue, { emitEvent });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AgreementsListFilter } from "../../../models/agreements-list/agreements-list-filter";
import { debounceTime, filter, switchMap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-agreements-list-filter',
  templateUrl: './agreements-list-filter.component.html',
  styleUrls: ['./agreements-list-filter.component.scss']
})
export class AgreementsListFilterComponent implements OnInit, OnDestroy {

  @Output() filter = new EventEmitter<AgreementsListFilter>();
  @Output() showResults = new EventEmitter();
  @Input() resultsCount: number;

  readonly destroy$ = new Subject();

  form: FormGroup;
  formInitialValue: AgreementsListFilter = {};

  constructor(private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      numberOrName: '',
      issuedDateFrom: '',
      issuedDateTo: '',
      contragents: [[]],
    });

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


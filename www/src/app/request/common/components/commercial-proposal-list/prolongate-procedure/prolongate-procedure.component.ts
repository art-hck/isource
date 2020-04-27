import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { ToastActions } from "../../../../../shared/actions/toast.actions";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommercialProposalsService } from "../../../../back-office/services/commercial-proposals.service";
import { Store } from "@ngxs/store";
import { Uuid } from "../../../../../cart/models/uuid";
import * as moment from "moment";
import { Moment } from "moment";
import { catchError, finalize, takeUntil, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Component({
  selector: 'app-prolongate-procedure',
  templateUrl: './prolongate-procedure.component.html'
})
export class ProlongateProcedureComponent implements OnChanges, OnDestroy {

  @Input() requestId: Uuid;
  @Input() procedureId: string;
  @Input() date: string;
  @Output() close = new EventEmitter();
  @Output() complete = new EventEmitter();
  form: FormGroup;
  parsedDate: Moment;
  isLoading: boolean;
  readonly destroy$ = new Subject();

  ngOnChanges() {
    this.parsedDate = moment(this.date);
    this.form = this.fb.group({
      requestId: [this.requestId, Validators.required],
      procedureId: [this.procedureId, Validators.required],
      date: [this.parsedDate.format('DD.MM.YYYY HH:mm'), Validators.required]
    });
  }

  constructor(
    private offersService: CommercialProposalsService,
    private store: Store,
    private fb: FormBuilder,
  ) {
  }

  submit() {
    const { requestId, procedureId, date } = this.form.value;
    this.isLoading = true;
    this.offersService.prolongateProcedureEndDate(requestId, procedureId, moment(date, "DD.MM.YYYY HH:mm")).pipe(
      tap(() => this.store.dispatch(new ToastActions.Success("Дата окончания процедуры изменена"))),
      tap(() => this.complete.emit()),
      catchError(err => {
        this.store.dispatch(new ToastActions.Error(err?.error?.detail ?? "Не удалось изменить дату окончания процедуры"));
        return throwError(err);
      }),
      finalize(() => this.isLoading),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

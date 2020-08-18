import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommercialProposalsService } from "../../services/commercial-proposals.service";
import { Store } from "@ngxs/store";
import { Uuid } from "../../../../cart/models/uuid";
import * as moment from "moment";
import { Moment } from "moment";
import { catchError, finalize, takeUntil, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Component({
  selector: 'app-procedure-prolongate',
  templateUrl: './procedure-prolongate.component.html'
})
export class ProcedureProlongateComponent implements OnChanges, OnDestroy {

  @Input() requestId: Uuid;
  @Input() procedureId: number;
  @Input() dateEndRegistration: string;
  @Input() dateSummingUp: string;
  @Output() close = new EventEmitter();
  @Output() complete = new EventEmitter();
  form: FormGroup;
  parsedDateEndRegistration: Moment;
  parsedDateSummingUp: Moment;
  isLoading: boolean;
  readonly destroy$ = new Subject();

  ngOnChanges() {
    this.parsedDateEndRegistration = moment(this.dateEndRegistration);
    this.parsedDateSummingUp = moment(this.dateSummingUp);

    this.form = this.fb.group({
      requestId: [this.requestId, Validators.required],
      procedureId: [this.procedureId, Validators.required],
      dateEndRegistration: [this.parsedDateEndRegistration.format('DD.MM.YYYY HH:mm'), Validators.required],
      dateSummingUp: [this.parsedDateSummingUp.format('DD.MM.YYYY HH:mm'), Validators.required],
    });

    this.form.get("dateEndRegistration").valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        const dateSummingUp = this.form.get("dateSummingUp").value;

        moment(date, "DD.MM.YYYY").isAfter(moment(dateSummingUp, "DD.MM.YYYY")) ?
          this.form.get("dateEndSummingUp").setErrors({ afterEndRegistrationDate: true}) :
          this.form.get("dateEndSummingUp").setErrors(null);
      });

    this.form.get("dateSummingUp").valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        const dateEndRegistration = this.form.get("dateEndRegistration").value;

        moment(date, "DD.MM.YYYY").isBefore(moment(dateEndRegistration, "DD.MM.YYYY")) ?
          this.form.get("dateSummingUp").setErrors({ afterEndRegistrationDate: true}) :
          this.form.get("dateSummingUp").setErrors(null);
      });
  }

  constructor(
    private offersService: CommercialProposalsService,
    private store: Store,
    private fb: FormBuilder,
  ) {
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const { requestId, procedureId, dateEndRegistration, dateSummingUp } = this.form.value;
    this.isLoading = true;
    this.offersService.prolongateProcedureEndDate(
      requestId,
      procedureId,
      moment(dateEndRegistration, "DD.MM.YYYY HH:mm"),
      moment(dateSummingUp, "DD.MM.YYYY HH:mm")
    ).pipe(
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

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ToastActions } from "../../../../../shared/actions/toast.actions";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommercialProposalsService } from "../../../../back-office/services/commercial-proposals.service";
import { Store } from "@ngxs/store";
import { Uuid } from "../../../../../cart/models/uuid";
import * as moment from "moment";

@Component({
  selector: 'app-prolongate-procedure',
  templateUrl: './prolongate-procedure.component.html'
})
export class ProlongateProcedureComponent implements OnChanges {

  @Input() requestId: Uuid;
  @Input() procedureId: string;
  @Input() date: string;
  @Output() close = new EventEmitter();
  form: FormGroup;

  ngOnChanges() {
    this.form = this.fb.group({
      requestId: [this.requestId, Validators.required],
      procedureId: [this.procedureId, Validators.required],
      date: [moment(this.date).format('DD.MM.YYYY HH:mm'), Validators.required]
    });
  }

  constructor(
    private offersService: CommercialProposalsService,
    private store: Store,
    private fb: FormBuilder,
  ) {}

  submit() {
    const {requestId, procedureId, date } = this.form.value;
    this.offersService.prolongateProcedureEndDate(requestId, procedureId, date).subscribe(() => {
      this.close.emit();
      this.store.dispatch(new ToastActions.Success("Дата окончания процедуры изменена"));
    });

  }
}

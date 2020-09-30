import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContragentWithPositions } from "../../../common/models/contragentWithPositions";
import { Request } from "../../../common/models/request";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestPosition } from "../../../common/models/request-position";
import { Store } from "@ngxs/store";
import { ContractActions } from "../../actions/contract.actions";
import AddContract = ContractActions.AddContract;
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss']
})
export class ContractFormComponent implements OnInit {

  @Input() contragentsWithPositions: ContragentWithPositions[] = [];
  @Input() request: Request;
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  positions: RequestPosition[];

  destroy$ = new Subject();

  get contragents(): ContragentList[] {
    return this.contragentsWithPositions?.map(contragentsWithPosition => contragentsWithPosition.supplier);
  }

  constructor(public store: Store,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      contragent: null,
      positions: [[], Validators.required]
    });

    this.form.get('contragent').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(contragentId => {
      this.positions = this.getContragentPositions(contragentId);
    });

    this.form.get('contragent').setValue(this.contragents[0]?.id);
  }

  public getContragentPositions(contragentId: Uuid): RequestPosition[] {
    return this.contragentsWithPositions
      .filter(contragentsWithPosition => contragentsWithPosition.supplier.id === contragentId)
      .map(contragentsWithPosition => contragentsWithPosition.positions)
      .reduce((prev, curr) => [...prev, ...curr], []);
  }

  public submit(): void {
      const contragentId: Uuid = this.form.get('contragent').value;
      const positions: RequestPosition[] = this.form.get('positions').value
        .map((v, i) => v ? this.getContragentPositions(contragentId)[i] : null)
        .filter(v => v !== null)
      ;
      this.store.dispatch(new AddContract(this.request.id, contragentId, positions)).pipe(takeUntil(this.destroy$)).subscribe(
        (result) => {
          this.close.emit();
          const e = result.error as any;
          this.store.dispatch(e ?
            new ToastActions.Error(e && e?.error?.detail) : new ToastActions.Success('Договор успешно добавлен')
          );
        }
      );
  }

  filterPositions = (q: string, position: RequestPosition): boolean => position.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
  trackById = (item: RequestPosition) => item.id;

}

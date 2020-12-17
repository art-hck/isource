import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ContragentWithPositions } from "../../../common/models/contragentWithPositions";
import { Request } from "../../../common/models/request";
import { FormBuilder, Validators } from "@angular/forms";
import { RequestPosition } from "../../../common/models/request-position";
import { Store } from "@ngxs/store";
import { ContractActions } from "../../actions/contract.actions";
import { map, takeUntil } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import Create = ContractActions.Create;

@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss']
})
export class ContractFormComponent implements AfterViewInit {
  @Input() suppliers: ContragentWithPositions[] = [];
  @Input() request: Request;
  @Output() close = new EventEmitter<void>();

  readonly form = this.fb.group({ contragentId: null, positions: [[], Validators.required] });
  readonly destroy$ = new Subject();
  readonly positions$: Observable<RequestPosition[]> = this.form.get('contragentId').valueChanges.pipe(
    map(contragentId => this.suppliers.find(({ supplier }) => supplier.id === contragentId).positions),
  );

  constructor(public store: Store, private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.suppliers) {
      this.form.get('contragentId').setValue(this.suppliers[0]?.supplier.id);
    }
    this.cd.detectChanges();
  }

  public submit(): void {
    const { contragentId, positions } = this.form.value;
    this.store.dispatch(new Create(this.request.id, contragentId, positions)).pipe(takeUntil(this.destroy$));
    this.close.emit();
  }

  filterPositions = (q: string, position: RequestPosition): boolean => position.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
  trackById = (item: RequestPosition) => item.id;
}

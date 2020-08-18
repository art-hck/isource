import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Request } from "../../../common/models/request";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { finalize, shareReplay, takeUntil, tap } from "rxjs/operators";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { proposalManufacturerValidator } from "../proposal-form-manufacturer/proposal-form-manufacturer.validator";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { getCurrencySymbol } from "@angular/common";
import { technicalCommercialProposalParametersFormValidator } from "./technical-commercial-proposal-parameters-form/technical-commercial-proposal-parameters-form.validator";
import { StateStatus } from "../../../common/models/state-status";
import { RequestPosition } from "../../../common/models/request-position";
import Update = TechnicalCommercialProposals.Update;
import Create = TechnicalCommercialProposals.Create;
import Publish = TechnicalCommercialProposals.Publish;
import { UxgModalComponent } from "uxg";

@Component({
  selector: 'app-technical-commercial-proposal-form',
  templateUrl: './technical-commercial-proposal-form.component.html',
  styleUrls: ['./technical-commercial-proposal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalFormComponent implements OnInit, OnDestroy {

  @ViewChild('uploadTemplateModal') uploadTemplateModal: UxgModalComponent;
  @Input() request: Request;
  @Input() technicalCommercialProposal: TechnicalCommercialProposal;
  @Input() closable = true;
  @Output() close = new EventEmitter();
  @Select(TechnicalCommercialProposalState.status)
  readonly status$: Observable<StateStatus>;
  @Select(TechnicalCommercialProposalState.availablePositions)
  readonly availablePositions$: Observable<RequestPosition[]>;
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly parametersValidator = technicalCommercialProposalParametersFormValidator;
  readonly manufacturerValidator = proposalManufacturerValidator;
  readonly destroy$ = new Subject();
  form: FormGroup;
  contragents$: Observable<ContragentList[]>;
  invalidDocControl = false;
  manufactureErrorMessage = false;
  parameterErrorMessage = false;

  get isManufacturerPristine(): boolean {
    return this.form.get("positions").value.filter(pos => pos.manufacturingName).length === 0;
  }

  constructor(
    private fb: FormBuilder,
    private contragentService: ContragentService,
    private store: Store,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      supplier: [this.defaultValue('supplier', null), Validators.required],
      documents: [this.defaultValue('documents', [])],
      positions: [this.defaultValue('positions', []), [Validators.required, this.parametersValidator, this.manufacturerValidator]],
    });

    if (this.technicalCommercialProposal) {
      this.form.addControl("id", this.fb.control(this.defaultValue('id', null)));
    }

    // Workaround sync with multiple elements per one formControl
    this.form.get('positions').valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(v => this.form.get('positions').setValue(v, {onlySelf: true, emitEvent: false}));

    this.form.valueChanges.subscribe(() => {
      const docsCount = this.form.get('documents').value.length + this.defaultValue('documents').length;

      if (this.form.get('documents').dirty) {
        if (docsCount === 0 && this.form.get('positions').invalid) {
          this.invalidDocControl = true;
        }

        if (docsCount > 0) {
          this.invalidDocControl = false;
        }
      }

      if (this.form.get('positions').dirty && this.form.get('positions').value.length && this.isManufacturerPristine) {
        this.manufactureErrorMessage = true;
        this.parameterErrorMessage = true;
        this.invalidDocControl = false;
      }

      this.form.get('positions').setValidators(
        docsCount > 0 && this.isManufacturerPristine ?
          [Validators.required] :
          [Validators.required, proposalManufacturerValidator]
      );

      this.form.get('positions').updateValueAndValidity({ emitEvent: false });

      this.cd.detectChanges();
    });

    this.contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));
    this.store.dispatch(new TechnicalCommercialProposals.FetchAvailablePositions(this.request.id));
  }

  submit(publish = true): void {
    this.form.get('positions').markAsDirty();
    this.form.get('positions').markAsTouched();

    if (this.form.valid) {
      let action$: Observable<any>;
      const documents = this.form.get('documents').value.filter(({ valid }) => valid).map(({ file }) => file);
      this.form.disable();

      if (this.form.pristine) {
        publish ? action$ = this.publish() : this.close.emit();
      } else {
        action$ = this.save({ ...this.form.value, documents }, publish);
      }

      action$.pipe(
        tap(() => this.close.emit()),
        finalize(() => this.form.enable()),
        takeUntil(this.destroy$)
      ).subscribe();
    } else {
      this.form.updateValueAndValidity({ emitEvent: false });
    }
  }

  save(value, publish) {
    return this.store.dispatch(
      value.id ? new Update(value, publish) : new Create(this.request.id, value, publish)
    );
  }

  publish() {
    return this.store.dispatch(new Publish(this.technicalCommercialProposal));
  }

  toProposalPositions(positions: RequestPosition[]): Partial<TechnicalCommercialProposalPosition>[] {
    return positions.map(position => ({position}));
  }

  searchPosition(q: string, {position}: TechnicalCommercialProposalPosition) {
    return position.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
  }

  searchContragent(query: string, contragents: ContragentList[]) {
    return contragents.filter(
      c => c.shortName.toLowerCase().indexOf(query.toLowerCase()) >= 0 || c.inn.indexOf(query) >= 0);
  }

  defaultValue = (field: keyof TechnicalCommercialProposal, defaultValue: any = "") => this.technicalCommercialProposal && this.technicalCommercialProposal[field] || defaultValue;
  getContragentName = (contragent: ContragentList) => contragent.shortName || contragent.fullName;
  trackByPositionId = ({position}: TechnicalCommercialProposalPosition) => position.id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Request } from "../../../common/models/request";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, throwError } from "rxjs";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { catchError, shareReplay, takeUntil, tap } from "rxjs/operators";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { proposalManufacturerValidator } from "../proposal-form-manufacturer/proposal-form-manufacturer.validator";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { getCurrencySymbol } from "@angular/common";
import { technicalCommercialProposalParametersFormValidator } from "./technical-commercial-proposal-parameters-form/technical-commercial-proposal-parameters-form.validator";
import { StateStatus } from "../../../common/models/state-status";
import { NotificationService } from "../../../../shared/services/notification.service";
import { RequestPosition } from "../../../common/models/request-position";
import Update = TechnicalCommercialProposals.Update;
import Create = TechnicalCommercialProposals.Create;
import Publish = TechnicalCommercialProposals.Publish;

@Component({
  selector: 'app-technical-commercial-proposal-form',
  templateUrl: './technical-commercial-proposal-form.component.html',
  styleUrls: ['./technical-commercial-proposal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalFormComponent implements OnInit, OnDestroy {
  @Input() request: Request;
  @Input() technicalCommercialProposal: TechnicalCommercialProposal;
  @Input() closable = true;
  @Output() close = new EventEmitter();
  @Select(TechnicalCommercialProposalState.status)
  status$: Observable<StateStatus>;
  @Select(TechnicalCommercialProposalState.availablePositions)
  availablePositions$: Observable<RequestPosition[]>;
  form: FormGroup;
  contragents$: Observable<ContragentList[]>;
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly parametersValidator = technicalCommercialProposalParametersFormValidator;
  readonly manufacturerValidator = proposalManufacturerValidator;
  readonly destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private contragentService: ContragentService,
    private store: Store,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      supplier: [this.defaultValue('supplier', null), Validators.required],
      documents: [this.defaultValue('documents', [])],
      positions: [this.defaultValue('positions', []), [Validators.required, this.parametersValidator, this.manufacturerValidator]],
      files: [[]],
    });

    if (this.technicalCommercialProposal) {
      this.form.addControl("id", this.fb.control(this.defaultValue('id', null)));
    }

    // Workaround sync with multiple elements per one formControl
    this.form.get('positions').valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(v => this.form.get('positions').setValue(v, {onlySelf: true, emitEvent: false}));

    this.contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));
    this.store.dispatch(new TechnicalCommercialProposals.FetchAvailablePositions(this.request.id));
  }

  submit(publish = true): void {
    if (this.form.invalid) { return; }

    this.form.disable();

    if (this.form.pristine) {
      publish ? this.publish() : this.close.emit();
    } else {
      this.save(this.form.value, publish);
    }
  }

  save(value, publish) {
    const event = value.id ? new Update(this.request.id, value, publish) : new Create(this.request.id, value, publish);
    this.store.dispatch(event).pipe(
      takeUntil(this.destroy$),
      catchError(({error}) => {
        this.notificationService.toast(error && error.detail, "error");
        this.form.enable();
        return throwError(error);
      }),
      tap(() => this.notificationService.toast(`ТКП успешно ${publish ? "отправлено" : "сохранено"}`)),
      tap(() => this.close.emit())
    ).subscribe();
  }

  publish() {
    this.store.dispatch(new Publish(this.request.id, this.technicalCommercialProposal)).pipe(
      takeUntil(this.destroy$),
      tap(() => this.notificationService.toast(`ТКП успешно отправлено`)),
      tap(() => this.close.emit())
    ).subscribe();
  }

  toProposalPosition(positions: RequestPosition[]): Partial<TechnicalCommercialProposalPosition>[] {
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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { finalize, map, shareReplay, takeUntil, tap } from "rxjs/operators";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { proposalManufacturerValidator } from "../proposal-form-manufacturer/proposal-form-manufacturer.validator";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { getCurrencySymbol } from "@angular/common";
import { commonProposalParametersFormValidator } from "./common-proposal-parameters-form/common-proposal-parameters-form.validator";
import { StateStatus } from "../../../common/models/state-status";
import { RequestPosition } from "../../../common/models/request-position";
import { UxgModalComponent } from "uxg";
import { DeliveryType } from "../../enum/delivery-type";
import { DeliveryTypeLabels } from "../../../common/dictionaries/delivery-type-labels";
import { CurrencyLabels } from "../../../common/dictionaries/currency-labels";
import { PositionCurrency } from "../../../common/enum/position-currency";
import { Uuid } from "../../../../cart/models/uuid";
import { searchContragents } from "../../../../shared/helpers/search";

@Component({
  selector: 'app-technical-commercial-proposal-form',
  templateUrl: './common-proposal-form.component.html',
  styleUrls: ['./common-proposal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonProposalFormComponent implements OnInit, OnDestroy {

  @ViewChild('uploadTemplateModal') uploadTemplateModal: UxgModalComponent;
  @Input() request: Request;
  @Input() groupId: Uuid;
  @Input() technicalCommercialProposal: TechnicalCommercialProposal;
  @Input() closable = true;
  @Input() source: string;
  @Input() availablePositions: RequestPosition[];
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();
  @Select(TechnicalCommercialProposalState.status)
  readonly status$: Observable<StateStatus>;
  readonly deliveryType = DeliveryType;
  readonly deliveryTypeLabel = DeliveryTypeLabels;
  readonly currencies = Object.entries(CurrencyLabels);
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly parametersValidator = commonProposalParametersFormValidator;
  readonly manufacturerValidator = proposalManufacturerValidator;
  readonly searchContragents = searchContragents;
  readonly destroy$ = new Subject();

  form: FormGroup;
  contragents$: Observable<ContragentList[]>;
  invalidDocControl = false;
  manufactureErrorMessage = false;
  parameterErrorMessage = false;
  publish = this.fb.control(true);

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
      files: [[]],
      deliveryType: [this.technicalCommercialProposal?.deliveryType || this.deliveryType.INCLUDED],
      deliveryAdditionalTerms: [this.technicalCommercialProposal?.deliveryAdditionalTerms || ''],
      warrantyConditions: [this.technicalCommercialProposal?.warrantyConditions || '', Validators.required],
      deliveryPrice: [this.technicalCommercialProposal?.deliveryPrice || ''],
      deliveryCurrency: [PositionCurrency.RUB],
      deliveryPickup: [this.technicalCommercialProposal?.deliveryPickup || '']
    });

    if (this.technicalCommercialProposal) {
      this.form.addControl("id", this.fb.control(this.defaultValue('id', null)));
    }

    // Workaround sync with multiple elements per one formControl
    this.form.get('positions').valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(v => this.form.get('positions').setValue(v, {onlySelf: true, emitEvent: false}));

    this.form.valueChanges.subscribe(() => {
      const docsCount = this.form.get('files').value.length + this.defaultValue('documents').length;

      if (this.form.get('files').dirty) {
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

      this.form.get('deliveryPickup').setValidators(
        this.form.get('deliveryType').value === this.deliveryType.PICKUP ? [Validators.required] : null);

      this.form.get('deliveryPrice').setValidators(
        this.form.get('deliveryType').value === this.deliveryType.NOT_INCLUDED ? [Validators.required] : null);

      this.form.get('positions').updateValueAndValidity({ emitEvent: false });

      this.cd.detectChanges();
    });

    this.contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));
  }

  submit(): void {
    if (this.form.valid) {
      const files = this.form.get('files').value.filter(({ valid }) => valid).map(({ file }) => file);
      this.form.disable();
      this.save.emit({ ...this.form.value, files });
      this.close.emit();
      this.form.enable();
    } else {
      this.form.updateValueAndValidity({ emitEvent: false });
    }
  }

  searchPosition(q: string, {position}: { position: RequestPosition }) {
    return position.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
  }

  defaultValue = (field: keyof TechnicalCommercialProposal, defaultValue: any = "") => this.technicalCommercialProposal && this.technicalCommercialProposal[field] || defaultValue;
  getContragentName = (contragent: ContragentList) => contragent.shortName || contragent.fullName;
  trackByPositionId = ({id}: RequestPosition) => id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

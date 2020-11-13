import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Request } from "../../../common/models/request";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { shareReplay, takeUntil } from "rxjs/operators";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { Select, Store } from "@ngxs/store";
import { proposalManufacturerValidator } from "../proposal-form-manufacturer/proposal-form-manufacturer.validator";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { getCurrencySymbol } from "@angular/common";
import { proposalParametersFormValidator } from "./proposal-parameters-form/proposal-parameters-form.validator";
import { StateStatus } from "../../../common/models/state-status";
import { RequestPosition } from "../../../common/models/request-position";
import { UxgModalComponent } from "uxg";
import { DeliveryType } from "../../enum/delivery-type";
import { DeliveryTypeLabels } from "../../../common/dictionaries/delivery-type-labels";
import { CurrencyLabels } from "../../../common/dictionaries/currency-labels";
import { PositionCurrency } from "../../../common/enum/position-currency";
import { Uuid } from "../../../../cart/models/uuid";
import { searchContragents } from "../../../../shared/helpers/search";
import { CommonProposal, CommonProposalItem } from "../../../common/models/common-proposal";

@Component({
  selector: 'app-common-proposal-form',
  templateUrl: './proposal-form.component.html',
  styleUrls: ['./proposal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProposalFormComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('uploadTemplateModal') uploadTemplateModal: UxgModalComponent;
  @Input() request: Request;
  @Input() groupId: Uuid;
  @Input() technicalCommercialProposal: TechnicalCommercialProposal;
  @Input() closable = true;
  @Input() source: string;
  @Input() availablePositions: RequestPosition[];
  @Output() close = new EventEmitter();
  @Output() create = new EventEmitter<{ proposal: Partial<CommonProposal>, items: CommonProposalItem[] }>();
  @Output() edit = new EventEmitter<{ proposal: Partial<CommonProposal> & { id: Uuid }, items: CommonProposalItem[] }>();

  @Select(TechnicalCommercialProposalState.status)
  readonly status$: Observable<StateStatus>;
  readonly deliveryType = DeliveryType;
  readonly deliveryTypeLabel = DeliveryTypeLabels;
  readonly currencies = Object.entries(CurrencyLabels);
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly parametersValidator = proposalParametersFormValidator;
  readonly manufacturerValidator = proposalManufacturerValidator;
  readonly searchContragents = searchContragents;
  readonly destroy$ = new Subject();

  form: FormGroup;
  contragents$: Observable<ContragentList[]>;
  invalidDocControl = false;
  manufactureErrorMessage = false;
  parameterErrorMessage = false;
  publish = this.fb.control(true);
  proposalPositions: { position: RequestPosition }[];

  get isManufacturerPristine(): boolean {
    return this.form.get("positions").value.filter(pos => pos.manufacturingName).length === 0;
  }

  constructor(
    private fb: FormBuilder,
    private contragentService: ContragentService,
    private store: Store,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnChanges({ availablePositions }: SimpleChanges) {
    if (availablePositions) {
      this.proposalPositions = this.availablePositions?.map(position => ({ position }));
    }
  }

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
      this.form.disable();
      const { positions, supplier, ...proposal } = this.form.value;
      const items = positions.map(({ position, ...item }) => ({ requestPositionId: position.id, ...item }));
      const files = this.form.get('files').value.filter(({ valid }) => valid).map(({ file }) => file);
      const event = { proposal: { ...proposal, ...files, supplierId: supplier.id }, items };

      this.technicalCommercialProposal ? this.edit.emit(event) : this.create.emit(event);
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
  trackByPositionId = ({ position }) => position.id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { KimPriceOrder } from "../../../common/models/kim-price-order";
import { Store } from "@ngxs/store";
import { KimRequestActions } from "../../actions/kim-price-order.actions";
import { Uuid } from "../../../../cart/models/uuid";
import Create = KimRequestActions.Create;
import Update = KimRequestActions.Update;
import { KimPriceOrderType } from "../../../common/enum/kim-price-order-type";

@Component({
  selector: 'app-kim-price-order-form',
  templateUrl: './kim-price-order-form.component.html',
  styleUrls: ['./kim-price-order-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KimPriceOrderFormComponent implements OnInit {
  @Input() kimPriceOrder: KimPriceOrder;
  @Output() close = new EventEmitter();
  form: FormGroup;
  readonly formPositions = () => this.form.get('positions') as FormArray;
  readonly formRegions = () => this.form.get('regions') as FormArray;

  constructor(private fb: FormBuilder, private store: Store) { }

  ngOnInit() {
    this.form = this.fb.group({
      id: null,
      name: ["", Validators.required],
      regions: this.fb.array([this.fb.control("")], Validators.required),
      deliveryAddress: ["", Validators.required],
      deliveryConditions: ["", Validators.required],
      dateResponse: ["", Validators.required],
      dateDelivery: ["", Validators.required],
      type: [KimPriceOrderType.STANDART, Validators.required],
      forSmallBusiness: false,
      forProducer: false,
      forAuthorizedDealer: false,
      russianProduction: false,
      denyMaxPricePosition: false,
      positions: this.fb.array((this.kimPriceOrder && this.kimPriceOrder.positions || [null]).map(position => this.getFormPosition(position)), Validators.required)
    });

    this.form.patchValue(this.kimPriceOrder || {});
  }

  getFormPosition(position?: KimPriceOrder["positions"][number]): FormGroup {
    const form = this.fb.group({ name: [null, Validators.required] });
    form.patchValue(position || {});
    return form;
  }

  submit() {
    const body: Partial<KimPriceOrder> & {id: Uuid} = this.form.value;
    console.log(body);
    this.store.dispatch(body.id ? new Update(body) : new Create(body));
    this.close.emit();
  }
}

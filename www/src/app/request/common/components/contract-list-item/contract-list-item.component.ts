import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Contract } from "../../models/contract";
import { getCurrencySymbol } from "@angular/common";
import { FormBuilder, Validators } from "@angular/forms";
import moment from "moment";
import { StateStatus } from "../../models/state-status";

@Component({
  selector: 'app-contract-list-item',
  templateUrl: './contract-list-item.component.html',
  styleUrls: ['./contract-list-item.component.scss']
})
export class ContractListItemComponent implements OnChanges {
  @Input() contract: Contract;
  @Input() status: StateStatus;
  @Input() rollbackDuration: number;
  @Input() rollbackDate: string;
  @Output() send = new EventEmitter<{ comment?: string, file: File }>();
  @Output() rollback = new EventEmitter();
  @Output() approve = new EventEmitter();
  @Output() reject = new EventEmitter<{ comment?: string, file: File }>();
  @Output() download = new EventEmitter();
  folded: boolean;
  historyFolded = true;
  historyFoldedLength = 3;

  readonly getCurrencySymbol = getCurrencySymbol;
  readonly form = this.fb.group({ comment: "", file: null });

  get total(): number {
    return this.contract?.winners.reduce((total, { offerPosition: p }) => total += (p.priceWithoutVat * p.quantity), 0);
  }

  get canRollback(): boolean {
    return this.rollback.observers.length && ['ON_APPROVAL'].includes(this.contract.status) && moment().diff(moment(this.rollbackDate), 'seconds') < this.rollbackDuration;
  }

  get canSend(): boolean {
    return this.send.observers.length && ['NEW', 'REJECTED'].includes(this.contract.status);
  }

  get canReject(): boolean {
    return this.reject.observers.length && ['ON_APPROVAL'].includes(this.contract.status);
  }

  get canApprove(): boolean {
    return this.approve.observers.length && ['ON_APPROVAL'].includes(this.contract.status);
  }

  constructor(private fb: FormBuilder) {}

  ngOnChanges() {
    this.form.get('file').setValidators(this.canSend ? Validators.required : null);
  }
}


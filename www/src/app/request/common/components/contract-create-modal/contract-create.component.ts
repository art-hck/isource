import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { Request } from "../../models/request";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { RequestPosition } from "../../models/request-position";
import { Contract } from "../../models/contract";
import { ContragentWithPositions } from "../../models/contragentWithPositions";
import { ContractService } from "../../services/contract.service";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-contract-create',
  templateUrl: './contract-create.component.html',
  styleUrls: ['./contract-create.component.scss']
})
export class ContractCreateComponent implements OnInit {

  @Input() contragentsWithPositions: ContragentWithPositions[] = [];
  @Input() request: Request;
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<Contract>();

  public form: FormGroup = new FormGroup({
    'contragent': new FormControl("Выберите поставщика", CustomValidators.validContragent),
    'positions': new FormArray([], CustomValidators.multipleCheckboxRequireOne)
  });

  get contragents() {
    return this.contragentsWithPositions.map(contragentsWithPosition => contragentsWithPosition.contragent);
  }

  get formPositions() {
    return this.form.get('positions') as FormArray;
  }

  get formContragentInvalid() {
    return this.form.get('contragent').dirty && this.form.get('contragent').invalid;
  }

  constructor(private contractService: ContractService) {
  }

  ngOnInit() {
    this.form.get('contragent').valueChanges.subscribe(contragent => {
      this.formPositions.clear();

      if (this.form.get('contragent').invalid) {
        return;
      }

      this.getContragentPositions(contragent)
        .forEach(position => this.formPositions.push(new FormControl(false))
        );
    });
  }

  public submit() {
    const contragent: ContragentList = this.form.get('contragent').value;
    const positions: RequestPosition[] = this.form.get('positions').value
      .map((v, i) => v ? this.getContragentPositions(contragent)[i] : null)
      .filter(v => v !== null)
    ;


    this.contractService.create(contragent, positions)
      .pipe(finalize(() => this.close.emit()))
      .subscribe((contract) => this.create.emit(contract))
    ;
  }

  public getContragentList(contragent) {
    return new ContragentList(contragent);
  }

  public getContragentPositions(contragent: ContragentList) {
    return this.contragentsWithPositions
      .filter(contragentsWithPosition => contragentsWithPosition.contragent.id === contragent.id)
      .map(contragentsWithPosition => contragentsWithPosition.positions)
      .reduce((prev, curr) => [...prev, ...curr])
      ;
  }

  public compareContragentByID(c1: ContragentList, c2: ContragentList) {
    return c1 && c2 && c1.id === c2.id;
  }
}

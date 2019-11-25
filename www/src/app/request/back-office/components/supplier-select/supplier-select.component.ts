import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContragentList} from "../../../../contragent/models/contragent-list";
import {ContragentService} from "../../../../contragent/services/contragent.service";

@Component({
  selector: 'app-supplier-select',
  templateUrl: './supplier-select.component.html',
  styleUrls: ['./supplier-select.component.scss']
})
export class SupplierSelectComponent implements OnInit {
  contragentForm: FormGroup;
  contragentsValue: ContragentList[] = [];
  showContragentList = false;

  @Input() contragentName: string;

  @Input()
  set contragents(value: ContragentList[]) {
    if (value.length) {
      this.contragentsValue = value;
    }
  }

  get contragents(): ContragentList[] {
    return this.contragentsValue;
  }

  @Output() contragentNameChange = new EventEmitter<string>();

  @Output() selectedContragent = new EventEmitter<ContragentList>();

  private wasInside = false;

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickOut() {
    if (!this.wasInside) {
      this.showContragentList = false;
    }
    this.wasInside = false;
  }

  constructor(
    private formBuilder: FormBuilder,
    private getContragentService: ContragentService
  ) { }

  ngOnInit() {
    this.contragentForm = this.formBuilder.group({
      searchContragent: [null, Validators.required]
    });
    this.getContragentList();
  }

  getContragentList(): void {
    if (this.contragents.length > 0) {
      return;
    }
    this.getContragentService.getContragentList().subscribe(
      (data: ContragentList[]) => {
        this.contragents = data;
      }
    );
  }

  getSearchValue() {
    return this.contragentName;
  }

  onShowContragentList() {
    this.showContragentList = !this.showContragentList;
  }

  onContragentInputChange(value) {
    this.contragentForm.get('searchContragent').setValue(value);
    this.contragentNameChange.emit(value);
    this.contragentName = value;
  }

  selectContragent(contragent: ContragentList) {
    this.contragentForm.patchValue({'searchContragent': contragent.shortName});

    this.contragentNameChange.emit(contragent.shortName);
    this.contragentName = contragent.shortName;

    this.showContragentList = false;
    this.selectedContragent.emit(contragent);
  }

  resetSearchFilter() {
    this.contragentName = "";
    this.contragentForm.patchValue({'searchContragent': null});
  }
}

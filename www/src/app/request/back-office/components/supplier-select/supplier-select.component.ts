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
  allContragents: ContragentList[] = [];
  contragentsValue: ContragentList[] = [];
  showContragentList = false;

  get contragents(): ContragentList[] {
    // у контрагентов из инпута приоритет над всеми
    if (this.inputContragents.length) {
      return this.inputContragents;
    }
    return this.allContragents;
  }

  @Input() contragentName: string;

  @Input() inputContragents: ContragentList[] = [];

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

    // если из инпута еще не пришли данные, то пытаемся загрузить весь список контрагентов
    if (!this.inputContragents.length) {
      this.getAllContragentList();
    }
  }

  getAllContragentList(): void {
    this.getContragentService.getContragentList().subscribe(
      (data: ContragentList[]) => {
        this.allContragents = data;
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

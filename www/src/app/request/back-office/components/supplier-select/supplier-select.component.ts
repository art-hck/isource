import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  contragents: ContragentList[];
  showContragentList = false;

  @Input() contragentName = "";

  @Output() selectedContragent = new EventEmitter<ContragentList>();
  @Output() showContragentInfo = new EventEmitter<boolean>();


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
    this.getContragentService.getContragentList().subscribe(
      (data: ContragentList[]) => {
        this.contragents = data;
      });
  }

  getSearchValue() {
    return this.contragentForm.value.searchContragent;
  }

  onShowContragentList() {
    this.showContragentList = !this.showContragentList;
  }

  onContragentInputChange(value) {
    // this.contragentForm.get('searchContragent').setValue(value);
    this.contragentName = value;
  }

  selectContragent(contragent: ContragentList) {
    this.contragentForm.patchValue({"searchContragent": contragent.shortName});
    this.showContragentList = false;
    this.selectedContragent.emit(contragent);
    this.showContragentInfo.emit(true);
  }
}

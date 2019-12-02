import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ContragentList } from "../../models/contragent-list";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'app-contragent-list',
  templateUrl: './contragent-list.component.html',
  styleUrls: ['./contragent-list.component.scss']
})
export class ContragentListComponent implements OnInit {

  @ViewChild('customerSearchInput', { static: false }) customerSearchInput: ElementRef;

  @Input() searchValue: string;
  @Input() contragents: ContragentList[];

  constructor(
    protected router: Router,
  ) { }

  ngOnInit() {
  }

  getCustomerSearchInputValue(): string {
    if (this.searchValue && this.customerSearchInput) {
      return this.customerSearchInput.nativeElement.value;
    }
    return this.searchValue;
  }

}

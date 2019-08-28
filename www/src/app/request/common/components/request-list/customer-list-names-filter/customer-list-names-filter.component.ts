import { Component, Input } from '@angular/core';
import {RequestsList} from "../../../models/requests-list/requests-list";
import {Subject} from "rxjs";
import {ClrDatagridFilter, ClrDatagridFilterInterface} from "@clr/angular";

@Component({
  selector: 'app-customer-list-names-filter',
  templateUrl: './customer-list-names-filter.component.html',
  styleUrls: ['./customer-list-names-filter.component.css']
})
export class CustomerListNamesFilterComponent implements ClrDatagridFilterInterface<RequestsList> {

  customerNameSearchQuery = '';
  changes = new Subject<any>();
  filterType = 'CustomerListNamesFilter';

  @Input() requests: RequestsList[];

  constructor(private filterContainer: ClrDatagridFilter) {
    filterContainer.setFilter(this);
  }


  accepts(request: RequestsList) {
    return true;
  }

  getValue(): string {
    return this.customerNameSearchQuery;
  }

  isActive(): boolean {
    return this.customerNameSearchQuery.length > 0;
  }

  inputChange(text: any) {
    this.customerNameSearchQuery = text;
    this.changes.next();
  }

  clearFilter() {
    this.customerNameSearchQuery = '';
    this.changes.next();
  }
}

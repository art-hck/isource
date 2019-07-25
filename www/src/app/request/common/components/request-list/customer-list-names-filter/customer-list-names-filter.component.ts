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

  @Input() requests: RequestsList[];

  constructor(private filterContainer: ClrDatagridFilter) {
    filterContainer.setFilter(this);
  }

  accepts(request: RequestsList) {
    if (this.customerNameSearchQuery.length === 0) {
      return true;
    }
    if (!request) {
      return false;
    }
    if (request) {
      const customerNameSearchQuery = this.customerNameSearchQuery.toLowerCase();
      const customerFullName = request.customer.name.toLowerCase();
      const customerShortName = request.customer.shortName.toLowerCase();

      return (
        customerNameSearchQuery === '' ||
        customerFullName === customerNameSearchQuery ||
        customerShortName === customerNameSearchQuery ||
        customerFullName.includes(customerNameSearchQuery) ||
        customerShortName.includes(customerNameSearchQuery)
      );
    }
  }

  isActive(): boolean {
    return this.customerNameSearchQuery.length > 0;
  }

  inputChange(text: any) {
    this.customerNameSearchQuery = text.replace(/^\s+|\s+$/gm, '');
    console.log(this.customerNameSearchQuery);
    this.changes.next();
  }

  clearFilter() {
    this.customerNameSearchQuery = '';
    this.changes.next();
  }
}

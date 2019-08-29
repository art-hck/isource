import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {RequestsList} from "../../../models/requests-list/requests-list";
import {Subject} from "rxjs";
import {ClrDatagridFilter, ClrDatagridFilterInterface} from "@clr/angular";
import { RequestWorkflowStepLabels } from "../../../dictionaries/request-workflow-step-labels";

@Component({
  selector: 'app-request-list-statuses-filter',
  templateUrl: './request-list-statuses-filter.component.html',
  styleUrls: ['./request-list-statuses-filter.component.css']
})
export class RequestListStatusesFilterComponent implements ClrDatagridFilterInterface<RequestsList> {

  requestWorkflowStepLabels = Object.entries(RequestWorkflowStepLabels);
  changes = new Subject<any>();
  statuses = [];
  filterType = 'RequestListStatusesFilter';

  @Input() requests: RequestsList[];
  @ViewChild('checkboxesListEl', { static: false }) checkboxesListElRef: ElementRef;

  constructor(private filterContainer: ClrDatagridFilter) {
    filterContainer.setFilter(this);
  }

  accepts(request: RequestsList) {
    return true;
  }

  getValue(): object {
    return this.statuses;
  }

  isActive(): boolean {
    return this.statuses.length !== 0;
  }

  toggleStatus(event: any) {
    const param = event.target.value;

    if (this.statuses.indexOf(param) > -1) {
      for (let i = 0; i < this.statuses.length; i++) {
        if (this.statuses[i] === param) {
          this.statuses.splice(i, 1);
        }
      }
    } else {
      this.statuses.push(param);
    }

    this.changes.next();
  }

  clearAllCheckboxes() {
    this.statuses = [];
    this.checkboxesListElRef.nativeElement.childNodes.forEach(el => {
      if (el.firstChild) {
        el.firstChild.firstChild.checked = false;
      }
    });
    this.changes.next();
  }
}

import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import {RequestPositionWorkflowStepLabels} from "../../../dictionaries/request-position-workflow-step-labels";
import {RequestsList} from "../../../models/requests-list/requests-list";
import {Subject} from "rxjs";
import {ClrDatagridFilter, ClrDatagridFilterInterface} from "@clr/angular";

@Component({
  selector: 'app-request-list-position-statuses-filter',
  templateUrl: './request-list-position-statuses-filter.component.html',
  styleUrls: ['./request-list-position-statuses-filter.component.css']
})
export class RequestListPositionStatusesFilterComponent implements ClrDatagridFilterInterface<RequestsList> {

  requestPositionWorkflowStepLabels = Object.entries(RequestPositionWorkflowStepLabels);
  changes = new Subject<any>();
  acceptionFlag = true;
  statuses = [];
  requestPositions: any;

  @Input() requests: RequestsList[];
  @ViewChild('checkboxesListEl', { static: false }) checkboxesListElRef: ElementRef;

  constructor(
    private filterContainer: ClrDatagridFilter
  ) {
    filterContainer.setFilter(this);
  }

  accepts(requests: RequestsList) {
    const that = this;

    if (requests.positions.length > 0) {
      requests.positions.some((item) => {
        return that.acceptionFlag = (!!(that.statuses.indexOf(item.status.name) > -1));
      });
    } else {
      that.acceptionFlag = false;
    }
    return this.acceptionFlag;
  }

  isActive(): boolean {
    return this.statuses.length !== 0;
  }

  toggleStatus(event: any) {
    const checkedStatus = event.target.value;

    if (this.statuses.indexOf(checkedStatus) > -1) {
      for (let i = 0; i < this.statuses.length; i++) {
        if (this.statuses[i] === checkedStatus) {
          this.statuses.splice(i, 1);
        }
      }
    } else {
      this.statuses.push(checkedStatus);
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

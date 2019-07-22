import {Component, Input, OnInit} from '@angular/core';
import {RequestPositionWorkflowStepLabels} from "../../../dictionaries/request-position-workflow-step-labels";
import {RequestsList} from "../../../models/requests-list/requests-list";
import {Subject} from "rxjs";
import {ClrDatagridFilter, ClrDatagridFilterInterface} from "@clr/angular";

@Component({
  selector: 'app-request-list-statuses-filter',
  templateUrl: './request-list-statuses-filter.component.html',
  styleUrls: ['./request-list-statuses-filter.component.css']
})
export class RequestListStatusesFilterComponent implements ClrDatagridFilterInterface<RequestsList> {

  requestPositionWorkflowStepLabels = Object.entries(RequestPositionWorkflowStepLabels);


  changes = new Subject<any>();

  flag = true;

  public statuses = [];

  @Input() requests: RequestsList[];

  constructor(private filterContainer: ClrDatagridFilter) {
    filterContainer.setFilter(this);
  }



  accepts(requests: RequestsList) {
    const that = this;

    if (requests.positions.length > 0) {
      requests.positions.some((item) => {
        if (!!(that.statuses.indexOf(item.status.name) > -1)) {
          that.flag = true;
          console.log('accepts true: ' + that.flag);
        } else {
          that.flag = false;
          console.log('accepts false: ' + that.flag);
        }
      });
    } else {
      that.flag = false;
    }

    return this.flag;
  }



  isActive(): boolean {
    return this.statuses.length !== 0;
  }


  toggleStatus(event: any) {
    const param = event.target.value;

    console.log('Есть статус «' + param + '» в массиве? — ', (this.statuses.indexOf(param) > -1));
    if (this.statuses.indexOf(param) > -1) {
      console.log('Этот статус уже есть, удаляю его из массива:');
      for (let i = 0; i < this.statuses.length; i++) {
        if (this.statuses[i] === param) {
          this.statuses.splice(i, 1);
        }
      }
    } else {
      console.log('Этого статуса, как оказалось, нет, поэтому добавляю:');
      this.statuses.push(param);
    }

    console.log(this.statuses);

    this.changes.next();
  }
}

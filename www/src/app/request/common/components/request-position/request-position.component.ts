import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { RequestPositionStatusService } from "../../services/request-position-status.service";
import { RequestPositionWorkflowSteps } from "../../enum/request-position-workflow-steps";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestDocument } from "../../models/request-document";
import * as moment from "moment";

@Component({
  selector: 'app-request-position',
  templateUrl: './request-position.component.html',
  styleUrls: ['./request-position.component.scss']
})
export class RequestPositionComponent implements OnInit {
  @Input() requestId: Uuid;
  @Input() position: RequestPosition;
  @Input() statuses: [string, string][];
  @Output() changeStatus = new EventEmitter<{ status, position }>();
  @Output() positionChange = new EventEmitter<RequestPosition>();
  datesWithDocuments: DateWithDocuments[];

  constructor(private positionStatusService: RequestPositionStatusService, public user: UserInfoService) {}

  ngOnInit() {
    this.datesWithDocuments = this.position.documents.reduce(
      (arr: DateWithDocuments[], document: RequestDocument) => {
        const date = moment(document.created).locale("ru").format('DD MMMM YYYY');
        let i = arr.findIndex(_item => _item.date === date);

        if (i < 0) {
          i = arr.push({date, documents: []}) - 1;
        }

        arr[i].documents.push(document);
        return arr;
      }, []
    );
  }

  isAfterManufacturing(position: RequestPosition): boolean {
    return this.positionStatusService.isStatusAfter(position.status, RequestPositionWorkflowSteps.MANUFACTURING);
  }

  getRelatedServicesList(position: RequestPosition): string {
    const relatedServices = [];

    if (position.isShmrRequired) {
      relatedServices.push('ШМР');
    }
    if (position.isPnrRequired) {
      relatedServices.push('ПНР');
    }
    if (position.isInspectionControlRequired) {
      relatedServices.push('Инспекционный контроль');
    }

    return relatedServices.join(', ');
  }
}

export class DateWithDocuments { date: string; documents: RequestDocument[]; }

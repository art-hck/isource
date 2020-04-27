import { Component, DoCheck, EventEmitter, Input, IterableDiffer, IterableDiffers, Output } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { RequestPositionStatusService } from "../../services/request-position-status.service";
import { PositionStatus } from "../../enum/position-status";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestDocument } from "../../models/request-document";
import * as moment from "moment";
import { Observable } from "rxjs";
import { UxgPopoverContentDirection } from "uxg";

@Component({
  selector: 'app-request-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements DoCheck {
  @Input() requestId: Uuid;
  @Input() position: RequestPosition;
  @Input() statuses: [string, string][];
  @Input() onDrafted: (position: RequestPosition) => Observable<RequestPosition>;
  @Output() changeStatus = new EventEmitter<{ status, position }>();
  @Output() positionChange = new EventEmitter<RequestPosition>();
  @Output() uploadDocuments = new EventEmitter<{ files: File[], position: RequestPosition }>();
  datesWithDocuments: DateWithDocuments[];
  iterableDiffer: IterableDiffer<any>;
  PopoverContentDirection = UxgPopoverContentDirection;

  constructor(
    private positionStatusService: RequestPositionStatusService,
    public user: UserInfoService,
    private iterableDiffers: IterableDiffers
  ) {
    this.iterableDiffer = iterableDiffers.find([]).create();
  }

  ngDoCheck() {
    if (this.iterableDiffer.diff(this.position.documents)) {
      this.setDatesWithDocuments();
    }
  }

  setDatesWithDocuments() {
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
    return this.positionStatusService.isStatusAfter(position.status, PositionStatus.MANUFACTURING);
  }

  isBeforeRKDApproved(position: RequestPosition) {
    return this.positionStatusService.isStatusPrevious(position.status, PositionStatus.RKD_APPROVED);
  }

  isNotActual(position: RequestPosition) {
    return position.status === PositionStatus.NOT_RELEVANT || position.status === PositionStatus.CANCELED;
  }

  getRelatedServicesList(position: RequestPosition): string {
    const relatedServices = {
      "ШМР": position.isShmrRequired,
      "ПНР": position.isPnrRequired,
      "Инспекционный контроль": position.isInspectionControlRequired
    };

    return Object.keys(relatedServices)
      .filter(key => relatedServices[key])
      .reduce((arr, key) => arr = [...arr, key], [])
      .join(', ');
  }
}

export class DateWithDocuments { date: string; documents: RequestDocument[]; }

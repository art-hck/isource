import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestPosition } from "../../models/request-position";
import { DocumentsService } from "../../services/documents.service";
import { ManufacturingService } from '../../services/manufacturing.service';
import { Observable } from "rxjs";
import { DeliveryMonitorInfo } from "../../models/delivery-monitor-info";
import { DeliveryMonitorService } from "../../services/delivery-monitor.service";
import * as moment from "moment";
import { InspectorStatus } from "../../enum/inspector-status";
import { InspectorStatusLabels } from "../../dictionaries/inspector-status-labels";
import { InspectorInfo } from "../../models/inspector-info";

@Component({
  selector: 'app-manufacturing',
  templateUrl: './manufacturing.component.html',
  styleUrls: ['./manufacturing.component.scss']
})
export class ManufacturingComponent implements OnInit {
  @Input() requestId: Uuid;
  @Input() requestPosition: RequestPosition;
  @Input() canUpload: boolean;

  manufacturingEvents = {
    "data": {
      "good": {
        "mtrEvents": [
          {
            "mtrEventId": "1",
            "goodId": "74",
            "occurredAt": "2019-12-03T11:40:55.000Z",
            "type": "PackagesLeftProductionOperationLink",
            "payload": {
              "productionOperationLinkId": "1"
            }
          },
          {
            "mtrEventId": "3",
            "goodId": "74",
            "occurredAt": "2019-12-03T11:42:38.000Z",
            "type": "CertificateUploaded",
            "payload": {
              "certificateId": "1"
            }
          },
          {
            "mtrEventId": "4",
            "goodId": "74",
            "occurredAt": "2019-12-03T11:43:00.000Z",
            "type": "PackagesLeftProductionOperationLink",
            "payload": {
              "productionOperationLinkId": "4"
            }
          },
        ]
      }
    }
  };

  deliveryMonitorInfo$: Observable<DeliveryMonitorInfo>;
  inspectorEvents$: Observable<InspectorInfo>;

  constructor(
    private formBuilder: FormBuilder,
    private manufacturingService: ManufacturingService,
    private documentsService: DocumentsService,
    private deliveryMonitorService: DeliveryMonitorService
  ) {
  }

  ngOnInit() {
    this.getDeliveryMonitorInfo();
    this.getInspectorInfo();
  }

  getDeliveryMonitorInfo(): void {
    this.deliveryMonitorInfo$ = this.deliveryMonitorService.getDeliveryMonitorInfo(this.requestPosition.id);
  }

  getInspectorInfo(): void {
    this.inspectorEvents$ = this.deliveryMonitorService.getInspectorInfo(this.requestPosition.id);
  }

  getEventsStartDate(event): string {
    return moment(new Date(event.data.good.mtrEvents[0].occurredAt)).locale("ru").format('dd, DD.MM');
  }

  getEventTitleByType(type) {
    switch (type) {
      case InspectorStatus.CERTIFICATE_UPLOADED:
        return InspectorStatusLabels[InspectorStatus.CERTIFICATE_UPLOADED];
      case InspectorStatus.PACKAGES_LEFT_PRODUCTION_OPERATION_LINK:
        return InspectorStatusLabels[InspectorStatus.PACKAGES_LEFT_PRODUCTION_OPERATION_LINK];
      case InspectorStatus.OPTION_VERIFICATION:
        return InspectorStatusLabels[InspectorStatus.OPTION_VERIFICATION];
    }
  }

}

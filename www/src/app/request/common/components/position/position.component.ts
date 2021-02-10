import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { RequestPositionStatusService } from "../../services/request-position-status.service";
import { PositionStatus } from "../../enum/position-status";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { Uuid } from "../../../../cart/models/uuid";
import { Observable } from "rxjs";
import { UxgPopoverContentDirection } from "uxg";
import { FeatureService } from "../../../../core/services/feature.service";
import { PositionDocuments } from "../../models/position-documents";
import { PositionDocumentsLabels } from "../../dictionaries/position-documents-labels";
import { KeyValue } from "@angular/common";

@Component({
  selector: 'app-request-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent {
  @Input() requestId: Uuid;
  @Input() position: RequestPosition;
  @Input() documents: PositionDocuments;
  @Input() statuses: [string, string][];
  @Input() onDrafted: (position: RequestPosition) => Observable<RequestPosition>;
  @Output() changeStatus = new EventEmitter<{ status, position }>();
  @Output() positionChange = new EventEmitter<RequestPosition>();
  @Output() uploadDocuments = new EventEmitter<{ files: File[], position: RequestPosition }>();
  @Output() rejectPosition = new EventEmitter<RequestPosition>();
  @Output() approvePosition = new EventEmitter<RequestPosition>();
  PopoverContentDirection = UxgPopoverContentDirection;
  folded = false;
  readonly positionDocumentsLabels = PositionDocumentsLabels;
  readonly PositionStatus = PositionStatus;

  constructor(
    private positionStatusService: RequestPositionStatusService,
    public user: UserInfoService,
    public featureService: FeatureService
  ) {}

  get docsLength() {
    return Object.values(this.documents ?? {}).reduce((count, docs) => count += docs.length, 0)
  }

  showInspection(position: RequestPosition): boolean {
    return (this.isAfterContracted(position) && position.isInspectionControlRequired) ?? false;
  }

  isAfterManufacturing(position: RequestPosition): boolean {
    return this.positionStatusService.isStatusAfter(position.status, PositionStatus.MANUFACTURING);
  }

  isAfterContracted(position: RequestPosition): boolean {
    return this.positionStatusService.isStatusAfter(position.status, PositionStatus.CONTRACTED);
  }

  isBeforeContractSigning(position: RequestPosition): boolean {
    return this.positionStatusService.isStatusPrevious(position.status, PositionStatus.CONTRACT_SIGNING);
  }

  isNotActual(position: RequestPosition) {
    return [PositionStatus.NOT_RELEVANT, PositionStatus.CANCELED].includes(position.status);
  }

  getRelatedServicesList(position: RequestPosition): string {
    const relatedServices = [
      ["ШМР", position.isShmrRequired],
      ["ПНР", position.isPnrRequired],
      ["Инспекционный контроль", position.isInspectionControlRequired]
    ];

    return relatedServices.filter(([_, v]) => v).reduce((arr, [k]) => [...arr, k], []).join(', ');
  }

  originalOrder = (a: KeyValue<keyof PositionDocuments, string>, b: KeyValue<keyof PositionDocuments, string>): number => {
    return Object.keys(PositionDocumentsLabels).indexOf(a.key as string) > Object.keys(PositionDocumentsLabels).indexOf(b.key as string) ? 1 : -1;
  }
}

import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NotificationService } from "../../../../../shared/services/notification.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RequestPosition } from "../../../models/request-position";
import { Uuid } from "../../../../../cart/models/uuid";
import { DeliveryMonitorService } from "../../../services/delivery-monitor.service";
import { InspectorStage } from "../../../models/delivery-monitor-info";
import { InspectorInfo } from "../../../models/inspector-info";
import { InspectorStatus } from "../../../enum/inspector-status";
import { InspectorStatusLabels } from "../../../dictionaries/inspector-status-labels";

@Component({
  selector: 'app-digital-inspector',
  templateUrl: 'digital-inspector.component.html',
  styleUrls: ['digital-inspector.component.scss']
})

export class DigitalInspectorComponent {

  @Input() inspectorStages: InspectorInfo[];
  @Input() position: RequestPosition;

  opened = false;
  shiftCount = 0;

  form = new FormGroup({
    occurredAt: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(
    private notificationService: NotificationService,
    private deliveryMonitorService: DeliveryMonitorService
  ) {}

  @HostListener('document:keyup', ['$event'])
  resetShift(e: KeyboardEvent) {
    if (e.key !== "Shift") {
      this.shiftCount = 0;
    }
  }

  @HostListener('document:keyup.shift')
  onShift() {
    if (this.opened) {
      return;
    }

    this.shiftCount++;

    if (this.shiftCount === 5) {
      this.notificationService.toast('Активация...', "warning");
    }

    if (this.shiftCount === 10) {
      this.shiftCount = 0;
      this.opened = true;
    }
  }

  submit() {
    if (this.form.invalid) {
      this.notificationService.toast('Заполните все поля!', "error");
      return;
    }

    const formData = this.form.value;
    formData.occurredAt = new Date(this.form.value.occurredAt);
    formData.positionId = this.position.id;

    this.form.reset();
    this.deliveryMonitorService.addInspectorStage(formData).subscribe();
    this.notificationService.toast('Добавлено');
    this.inspectorStages.push(formData);
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

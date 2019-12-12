import { Component, HostListener, Input } from '@angular/core';
import { NotificationService } from "../../../../../shared/services/notification.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RequestPosition } from "../../../models/request-position";
import { DeliveryMonitorService } from "../../../services/delivery-monitor.service";
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
    return InspectorStatusLabels[type];
  }
}

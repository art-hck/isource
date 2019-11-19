import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NotificationService } from "../../../../../shared/services/notification.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RequestPosition } from "../../../models/request-position";
import { Uuid } from "../../../../../cart/models/uuid";
import { DeliveryMonitorService } from "../../../services/delivery-monitor.service";
import { InspectorStage } from "../../../models/delivery-monitor-info";

@Component({
  selector: 'app-digital-inspector',
  templateUrl: 'digital-inspector.component.html',
  styleUrls: [
    './digital-inspector.component.scss',
    '../../manufacturing/manufacturing.component.scss'
  ]
})

export class DigitalInspectorComponent implements OnInit {

  @Input() inspectorStages: InspectorStage[] = [];
  @Input() requestId: Uuid;
  @Input() position: RequestPosition;

  gibertOpened = false;
  gibertShiftCount = 0;

  gibertForm = new FormGroup({
    requestId: new FormControl('', Validators.required),
    positionId: new FormControl('', Validators.required),
    createdDate: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(
    private notificationService: NotificationService,
    private deliveryMonitorService: DeliveryMonitorService
  ) {}

  ngOnInit() {
    this.gibertForm.get('positionId').setValue(this.position.id);
    this.gibertForm.get('requestId').setValue(this.requestId);
  }

  @HostListener('document:keyup', ['$event'])
  resetShift(e: KeyboardEvent) {
    if (e.key !== "Shift") {
      this.gibertShiftCount = 0;
    }
  }

  @HostListener('document:keyup.shift')
  gibertShift() {
    if (this.gibertOpened) {
      return;
    }

    this.gibertShiftCount++;

    if (this.gibertShiftCount === 5) {
      this.notificationService.toast('Вы собираетесь активировать режим "Жибер"', "warning");
    }

    if (this.gibertShiftCount === 10) {
      this.gibertShiftCount = 0;
      this.gibertOpened = true;
    }
  }

  gibertSubmit() {
    this.gibertOpened = false;
    const formData = this.gibertForm.value;
    const date = new Date();
    const time = this.gibertForm.value.createdDate.split(":");
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    formData.createdDate = date;

    this.deliveryMonitorService.addInspectorStage(formData).subscribe();
    this.notificationService.toast('Конишуа :)');
    this.inspectorStages.push(this.gibertForm.value);
  }
}

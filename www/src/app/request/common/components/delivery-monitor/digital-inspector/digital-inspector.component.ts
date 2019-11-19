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

  opened = false;
  shiftCount = 0;

  form = new FormGroup({
    // requestId: new FormControl('', Validators.required),
    // positionId: new FormControl('', Validators.required),
    createdDate: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(
    private notificationService: NotificationService,
    private deliveryMonitorService: DeliveryMonitorService
  ) {}

  ngOnInit() {
    // this.form.get('positionId').setValue(this.position.id);
    // this.form.get('requestId').setValue(this.requestId);
  }

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
    const date = new Date();
    const time = this.form.value.createdDate.split(":");
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    formData.createdDate = date;
    this.form.reset();
    this.deliveryMonitorService.addInspectorStage(formData).subscribe();
    this.notificationService.toast('Добавлено');
    this.inspectorStages.push(formData);
  }
}

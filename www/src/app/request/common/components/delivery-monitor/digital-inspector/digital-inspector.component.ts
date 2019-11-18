import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NotificationService } from "../../../../../shared/services/notification.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RequestPosition } from "../../../models/request-position";
import { Uuid } from "../../../../../cart/models/uuid";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-digital-inspector',
  templateUrl: 'digital-inspector.component.html',
  styleUrls: [
    './digital-inspector.component.scss',
    '../../manufacturing/manufacturing.component.scss'
  ]
})

export class DigitalInspectorComponent implements OnInit {

  @Input() inspectorEvents = [];
  @Input() requestId: Uuid;
  @Input() position: RequestPosition;

  gibertOpened = false;
  gibertShiftCount = 0;

  gibertForm = new FormGroup({
    requestId: new FormControl('', Validators.required),
    positionId: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  })

  constructor(private notificationService: NotificationService, private http: HttpClient) {
  }

  ngOnInit() {
    this.gibertForm.get('positionId').setValue(this.position.id);
    this.gibertForm.get('requestId').setValue(this.requestId);

    // this.inspectorEvents.push({
    //   time: "12:00",
    //   title: "Создан производственный график",
    //   description: "Период: Вс, 01.09.2019 г. — Пн, 30.09.2019 г.",
    // })
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

    const url = `/requests/backoffice/${this.requestId}/positions/${this.position.id}/fooBar`;

    this.http.post(url, this.gibertForm.value).subscribe();
    this.notificationService.toast('Конишуа :)');
    this.inspectorEvents.push(this.gibertForm.value);
  }
}

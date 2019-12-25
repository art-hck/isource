import { Component, Input } from '@angular/core';
import { UxgPositionStatus } from "./uxg-position-status";

@Component({
  selector: 'uxg-position-status',
  templateUrl: './uxg-position-status.component.html'
})
export class UxgPositionStatusComponent {
  @Input() status: UxgPositionStatus;
  @Input() label: string;
  @Input() count: number;
  @Input() textAlign: "left" | "right" = "right";
}

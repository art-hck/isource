import { Component, ElementRef, Input } from '@angular/core';
import { UxgIcons } from "./uxg-icons";

type UxgIconType = keyof typeof UxgIcons;

@Component({
  selector: 'uxg-icon',
  templateUrl: 'uxg-icon.component.html',
  styles: [':host { display: inline-flex }']
})

export class UxgIconComponent {
  @Input() shape: UxgIconType;
  @Input() size;
  @Input() dir;
  @Input() flip;

  constructor(public el: ElementRef) {}

}

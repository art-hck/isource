import { Component, ElementRef, Input } from '@angular/core';
import { UxgIcons } from "./uxg-icons";

@Component({
  selector: 'uxg-icon',
  templateUrl: 'uxg-icon.component.html',
  styles: [':host { display: inline-flex }']
})

export class UxgIconComponent {
  @Input() shape: keyof typeof UxgIcons;
  @Input() size;
  @Input() dir;
  @Input() flip;

  constructor(public el: ElementRef) {}

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'uxg-code',
  templateUrl: './uxg-code.component.html',
  styleUrls: ['./uxg-code.component.scss']
})
export class UxgCodeComponent {
  @Input() language: string;
}

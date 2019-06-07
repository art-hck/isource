import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart-supplier-sum',
  templateUrl: './sum.component.html',
  styleUrls: ['./sum.component.css']
})
export class SumComponent implements OnInit {

  @Input() sum = 0;
  @Input() buttonText = '';
  @Output() buttonClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onButtonClick(): void {
    this.buttonClick.emit();
  }

}

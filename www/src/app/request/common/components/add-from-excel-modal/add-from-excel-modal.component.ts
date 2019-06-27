import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-add-from-excel-modal',
  templateUrl: './add-from-excel-modal.component.html',
  styleUrls: ['./add-from-excel-modal.component.css']
})
export class AddFromExcelModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Input() templateUrl: string;

  constructor() { }

  ngOnInit() {
  }

  onClose(): void {
    this.close.emit();
  }

}

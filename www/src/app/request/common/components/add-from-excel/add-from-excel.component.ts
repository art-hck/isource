import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-add-from-excel',
  templateUrl: './add-from-excel.component.html',
  styleUrls: ['./add-from-excel.component.css']
})
export class AddFromExcelComponent implements OnInit {

  @Output() submit = new EventEmitter<File[]>();
  @Input() templateUrl: string;

  files: File[] = [];

  constructor() { }

  ngOnInit() {
  }

  onSendClick(): void {
    this.submit.emit(this.files);
  }

  onChangeFilesList(files: File[]): void {
    this.files = files;
  }

}

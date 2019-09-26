import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-add-from-excel',
  templateUrl: './add-from-excel.component.html',
  styleUrls: ['./add-from-excel.component.css']
})
export class AddFromExcelComponent implements OnInit {

  @Output() submit = new EventEmitter<{ files: File[], requestName: string }>();
  @Input() templateUrl: string;

  requestName = "";
  files: File[] = [];

  constructor() { }

  ngOnInit() {
  }

  onRequestNameChange(value) {
    this.requestName = value.trim();
  }

  onSendClick(): void {
    const requestData = {
      files: this.files,
      requestName: this.requestName
    };

    this.submit.emit(requestData);
  }

  onChangeFilesList(files: File[]): void {
    this.files = files;
  }

}

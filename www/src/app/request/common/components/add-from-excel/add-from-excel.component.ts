import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-add-from-excel',
  templateUrl: './add-from-excel.component.html',
  styleUrls: ['./add-from-excel.component.css']
})
export class AddFromExcelComponent implements OnInit {

  @Output() submit = new EventEmitter<File>();
  @Input() templateUrl: string;

  file: File|null = null;

  constructor() { }

  ngOnInit() {
  }

  onSendClick(): void {
    this.submit.emit(this.file);
  }

  protected onChangeUploadField(files: FileList): void {
    this.file = (files.length === 0) ? null : files[0];
  }

}

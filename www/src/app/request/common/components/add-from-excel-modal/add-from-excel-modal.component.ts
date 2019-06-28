import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-add-from-excel-modal',
  templateUrl: './add-from-excel-modal.component.html',
  styleUrls: ['./add-from-excel-modal.component.css']
})
export class AddFromExcelModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<File>();
  @Input() templateUrl: string;

  file: File|null = null;

  constructor() { }

  ngOnInit() {
  }

  onClose(): void {
    this.close.emit();
  }

  onOkClick(): void {
    this.submit.emit(this.file);
    this.close.emit();
  }

  protected onChangeUploadField(files: FileList): void {
    this.file = (files.length === 0) ? null : files[0];
  }

}

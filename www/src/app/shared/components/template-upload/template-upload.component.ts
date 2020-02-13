import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-template-upload',
  templateUrl: './template-upload.component.html',
  styleUrls: ['./template-upload.component.scss']
})
export class TemplateUploadComponent {

  documents: File[] = [];

  @Output() fileSelected = new EventEmitter<File[]>();
  @ViewChild('uploadEl', { static: false }) uploadElRef: ElementRef;

  addDocument(files: File[]) {
    this.documents.push(...files);
    this.onChangeDocuments();
  }

  removeDocument(document: File) {
    this.documents = this.documents.filter((item) => item !== document);
    this.onChangeDocuments();
  }

  onChangeDocuments() {
    this.fileSelected.emit(this.documents);
  }

  /**
   * Открывает окно для выбора файлов
   */
  open() {
    this.uploadElRef.nativeElement.click();
  }

  clear() {
    this.documents = [];
  }
}

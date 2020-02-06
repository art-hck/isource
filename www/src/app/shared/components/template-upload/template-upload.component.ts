import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-template-upload',
  templateUrl: './template-upload.component.html',
  styleUrls: ['./template-upload.component.scss']
})
export class TemplateUploadComponent implements OnInit {

  documents: File[] = [];

  constructor() { }

  ngOnInit() {
  }

  @Output() fileSelected = new EventEmitter<File[]>();

  @ViewChild('uploadEl', { static: false }) uploadElRef: ElementRef;

  addDocument(files: FileList) {
    this.documents = [...this.documents, ...Array.from(files)];
    this.onChangeDocuments();

    // очищаем, чтобы можно было снова загрузить тот же файл
    this.uploadElRef.nativeElement.value = '';
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

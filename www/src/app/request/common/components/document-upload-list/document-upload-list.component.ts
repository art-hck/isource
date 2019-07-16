import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

/**
 * Компонент для отображения и выбора файлов для последующей загрузки на сервер
 *
 * Используется для отображения списка еще НЕ загруженных файлов!
 */
@Component({
  selector: 'app-document-upload-list',
  templateUrl: './document-upload-list.component.html',
  styleUrls: ['./document-upload-list.component.css']
})
export class DocumentUploadListComponent implements OnInit {

  @Input() documents: File[] = [];

  @Input() uploadLabel = 'Выбрать документ';

  @Output() fileSelected = new EventEmitter<File[]>();

  @ViewChild('uploadEl', { static: false }) uploadElRef: ElementRef;

  ngOnInit() {
  }

  addDocument(files: FileList) {
    Array.from(files).forEach(file => {
      this.documents.push(file);
    });
    this.onChangeDocuments();

    // очищаем, чтобы можно было снова загрузить тот же файл
    this.uploadElRef.nativeElement.value = '';
  }

  removeDocument(document: File) {
    this.documents = this.documents.filter((item) => item.name !== document.name);
    this.onChangeDocuments();
  }

  onChangeDocuments() {
    this.fileSelected.emit(this.documents);
  }
}

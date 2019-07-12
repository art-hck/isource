import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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

  ngOnInit() {
  }

  addDocument(files: FileList) {
    Array.from(files).forEach(file => {
      this.documents.push(file);
    });
    this.onChangeDocuments();
  }

  removeDocument(document: File) {
    this.documents = this.documents.filter((item) => item.name !== document.name);
    this.onChangeDocuments();
  }

  onChangeDocuments() {
    this.fileSelected.emit(this.documents);
  }
}

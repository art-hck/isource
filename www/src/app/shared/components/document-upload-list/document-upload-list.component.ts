import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DocumentIconSize } from "../../enums/document-icon-size";

/**
 * Компонент для отображения и выбора файлов для последующей загрузки на сервер
 *
 * Используется для отображения списка еще НЕ загруженных файлов!
 */
@Component({
  selector: 'app-document-upload-list',
  templateUrl: './document-upload-list.component.html',
  styleUrls: ['./document-upload-list.component.scss']
})
export class DocumentUploadListComponent {

  @Input() documents: File[] = [];
  @Input() uploadLabel = 'Выбрать документ';
  @Input() dragAndDropAvailable = false;

  @Output() fileSelected = new EventEmitter<File[]>();

  @ViewChild('uploadEl') uploadElRef: ElementRef;

  public documentIconSize = DocumentIconSize;

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

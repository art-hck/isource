import {Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import { AttachedFile } from "../../../models/attached-file";
import { FileUploader } from "ng2-file-upload";

@Component({
  selector: 'app-purchase-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.css']
})

export class DocumentsListComponent implements OnInit, AfterViewInit {

  @Input() documents: AttachedFile[];
  @Input() uploader: FileUploader;
  @Input() placeholder = 'Список пуст';

  @Input() deleteEnable = false;
  @Input() uploadEnable = false;
  @Input() downloadEnable = false;

  @Output() fileSelected = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<AttachedFile>();
  @Output() showClick = new EventEmitter<AttachedFile>();
  @Output() downloadClick = new EventEmitter<AttachedFile>();

  @ViewChild('uploadEl', { static: false }) uploadElRef: ElementRef;

  /**
   * Определяет находится ли файл над областью дропа
   */
  isFileOver = false;

  constructor(
  ) {
  }

  ngAfterViewInit() {
    // Для возможности повторно загрузить один и тот же файл подряд
    // необходимо очищать value инпута после выбора файла.
    // see https://github.com/valor-software/ng2-file-upload/issues/220#issuecomment-226443925
    if (this.uploader) {
      this.uploader.onAfterAddingFile = (item => {
        this.uploadElRef.nativeElement.value = '';
      });
    }
  }

  ngOnInit() {
  }

  onFileSelected() {
    this.fileSelected.emit();
  }

  onDownloadClick(document: AttachedFile) {
    this.downloadClick.emit(document);
  }

  onDeleteClick(document: AttachedFile) {
    this.deleteClick.emit(document);
  }

  /**
   * Событие возникает, когда мы переносим файл в главный див компонента
   * @param $event
   */
  onDragEnter($event: DragEvent) {
    this.isFileOver = true;
    $event.preventDefault();
  }

  /**
   * Событие возникает, когда мы убираем курсор из дива drag&drop
   * @param $event
   */
  onDragLeave($event: DragEvent) {
    this.isFileOver = false;
    $event.preventDefault();
  }

  onDrop($event: DragEvent) {
    this.onDragLeave($event);
  }
}

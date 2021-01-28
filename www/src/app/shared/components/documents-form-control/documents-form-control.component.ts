import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { RequestDocument } from "../../../request/common/models/request-document";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { AppFile } from "../file/file";
import { AppConfig } from "../../../config/app.config";

@Component({
  selector: 'app-documents-form-control',
  templateUrl: 'documents-form-control.component.html',
  styleUrls: ['documents-form-control.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DocumentsFormControlComponent), multi: true}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DocumentsFormControlComponent implements ControlValueAccessor {
  @Input() documents: RequestDocument[];
  @Input() files: AppFile[];
  @Input() invalid: boolean;
  @Input() disabled: boolean;
  @Input() dragAndDrop = true;
  @Input() docType = 'ТКП';
  @Output() select = new EventEmitter<AppFile[]>();
  @Output() remove = new EventEmitter<number>();
  totalFilesSizeLimit: number = AppConfig.files.totalFilesSizeLimit;
  onTouched: (value) => void;
  onChange: (value) => void;

  removeFile(i) {
    this.remove.emit(i);
    this.files.splice(i, 1);

    // Список оставшихся файлов прогоняем через анализатор допустимых размеров
    this.files = this.processAttachments(this.files);

    if (this.onChange) { this.onChange(this.files); }
  }

  selectFile(files: File[]) {
    this.writeValue([...this.files, ...files.map(file => new AppFile(file))]);

    // Список выбранных файлов прогоняем через анализатор допустимых размеров
    this.files = this.processAttachments(this.files);

    this.select.emit(this.files);
    if (this.onChange) { this.onChange(this.files); }
  }

  // Анализируем и помечаем прикреплённые файлы на превышение допустимого размера прикреплений
  processAttachments(files: AppFile[]): AppFile[] {
    let selectedFilesTotalSize = 0;

    files.forEach((appFile, i) => {
      if (selectedFilesTotalSize + appFile.file.size < this.totalFilesSizeLimit) {
        selectedFilesTotalSize = selectedFilesTotalSize + appFile.file.size;
        files[i].invalidMark = false;
      } else {
        files[i].invalidMark = true;
      }
    });

    return files;
  }

  registerOnChange = fn => this.onChange = fn;
  registerOnTouched = fn => this.onTouched = fn;
  writeValue = value => this.files = value;
}

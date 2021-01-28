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
  onTouched: (value) => void;
  onChange: (value) => void;

  totalFilesSizeLimit: number = AppConfig.files.totalFilesSizeLimit;
  totalSelectedSize: number;
  processedFiles = [];

  removeFile(i) {
    // this.remove.emit(i);
    this.files.splice(i, 1);

    console.log(i);
    console.log(this.files);

    const processedFiles = this.processAttachments(this.files, true);

    if (this.onChange) { this.onChange(processedFiles); }
  }

  selectFile(files: File[]) {
    const processedFiles = this.processAttachments(files.map(file => new AppFile(file)));

    this.writeValue([...this.files, ...processedFiles]);

    console.log(processedFiles);

    this.select.emit(this.files);
    if (this.onChange) { this.onChange(this.files); }
  }

  processAttachments(files: AppFile[], onRemove = false): AppFile[] {
    const filesList = onRemove ? this.files : files;

    const selectedFilesTotalSize = this.files.filter(fileItem => !fileItem.invalid).map(fileItem => fileItem.file.size).reduce((a, b) => a + b, 0);

    filesList.forEach((appFile, i) => {
      console.log(this.totalFilesSizeLimit);
      console.log(selectedFilesTotalSize);
      console.log(appFile.file.size);

      if (this.totalFilesSizeLimit - selectedFilesTotalSize > appFile.file.size) {
        this.totalSelectedSize += appFile.file.size;
        console.log('marking as false');
        filesList[i].invalidMark = false;
      } else {
        console.log('marking as true');
        filesList[i].invalidMark = true;
      }
    });

    return filesList;
  }

  registerOnChange = fn => this.onChange = fn;
  registerOnTouched = fn => this.onTouched = fn;
  writeValue = value => this.files = value;
}

import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { RequestDocument } from "../../../request/common/models/request-document";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { AppFile } from "../file/file";

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
  @Output() select = new EventEmitter<AppFile[]>();
  @Output() remove = new EventEmitter<number>();
  onTouched: (value) => void;
  onChange: (value) => void;

  removeFile(i) {
    this.remove.emit(i);
    this.files.splice(i, 1);
    if (this.onChange) { this.onChange(this.files); }
  }

  selectFile(files: File[]) {
    this.select.emit(files.map(file => new AppFile(file)));
    this.writeValue([...this.files || [], ...files.map(file => new AppFile(file))]);
    if (this.onChange) { this.onChange(this.files); }
  }

  registerOnChange = fn => this.onChange = fn;
  registerOnTouched = fn => this.onTouched = fn;
  writeValue = value => this.files = value;
}

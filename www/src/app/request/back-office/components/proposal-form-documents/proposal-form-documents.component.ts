import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { RequestDocument } from "../../../common/models/request-document";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'proposal-form-documents',
  templateUrl: 'proposal-form-documents.component.html',
  styleUrls: ['proposal-form-documents.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ProposalFormDocumentsComponent), multi: true}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProposalFormDocumentsComponent implements ControlValueAccessor {
  @Input() documents: RequestDocument[];
  @Input() files: File[];
  @Input() disabled: boolean;
  @Output() select = new EventEmitter<File[]>();
  @Output() remove = new EventEmitter<number>();
  onTouched: (value) => void;
  onChange: (value) => void;

  removeFile(i) {
    this.remove.emit(i);
    this.files.splice(i, 1);
    if (this.onChange) { this.onChange(this.files); }
  }

  selectFile(files: File[]) {
    this.select.emit(files);
    this.writeValue([...this.files || [], ...files]);
    if (this.onChange) { this.onChange(this.files); }
  }

  registerOnChange = fn => this.onChange = fn;
  registerOnTouched = fn => this.onTouched = fn;
  writeValue = value => this.files = value;
}

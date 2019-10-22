import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Contract } from "../../models/contract";
import { FormControl, FormGroup } from "@angular/forms";
import { RequestDocument } from "../../models/request-document";
import { finalize } from "rxjs/operators";
import { ClrLoadingState } from "@clr/angular";
import { ContractService } from "../../services/contract.service";
import { Request } from "../../models/request";

@Component({
  selector: 'app-contract-upload-document',
  templateUrl: './contract-upload-document.component.html',
  styleUrls: ['./contract-upload-document.component.scss']
})
export class ContractUploadDocumentComponent implements OnChanges {
  @Input() request: Request;
  @Input() documents: RequestDocument[] = [];
  @Input() files: File[] = [];
  @Input() contract: Contract;
  @Output() complete = new EventEmitter();

  public forms: FormGroup[] = [];
  public uploadedFiles: File[] = [];

  constructor(private contractService: ContractService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isFilesChanged(changes.files) || true) {
      const files = this.files
        .filter(file => this.forms.map(form => form.get('file').value).indexOf(file) < 0);

      files.forEach(file => this.forms.push(
        new FormGroup({
          file: new FormControl(file),
          comment: new FormControl(''),
          state: new FormControl(ClrLoadingState.DEFAULT)
        })
      ))
      ;
    }
  }

  public fileAsDocument(file: File): RequestDocument {
    return {
      id: file.lastModified.toString(),
      created: file.lastModified.toString(),
      filename: file.name,
      extension: file.name.toLowerCase().split('.').pop(),
      mime: null,
      size: file.size
    };
  }

  public isFilesChanged(files: SimpleChange): boolean {
    return (files.currentValue || []).filter(prevFile => {
      return (files.previousValue || []).indexOf(prevFile) < 0;
    }).length > 0;
  }

  public submit(form: FormGroup): void {
    const file: File = form.get('file').value;
    const comment: string = form.get('comment').value;

    form.get('state').setValue(ClrLoadingState.LOADING);

    this.contractService.uploadDocument(this.request, this.contract, file, comment).pipe(
      finalize(() => {
        this.complete.emit();
        this.forms = this.forms.filter(_form => _form !== form);
      })
    ).subscribe(document => this.contract.documents = [...this.contract.documents, ...document]);
  }
}

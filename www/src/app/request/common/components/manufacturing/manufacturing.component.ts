import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestPosition } from "../../models/request-position";
import { DocumentsService } from "../../services/documents.service";
import { RequestDocument } from "../../models/request-document";
import { ManufacturingService } from '../../services/manufacturing.service';
import { ManufacturingDocument } from '../../models/manufacturing-document';
import { Manufacturing } from '../../models/manufacturing';

@Component({
  selector: 'app-manufacturing',
  templateUrl: './manufacturing.component.html',
  styleUrls: ['./manufacturing.component.scss']
})
export class ManufacturingComponent implements OnInit, OnChanges {
  @Input() requestId: Uuid;
  @Input() requestPosition: RequestPosition;
  @Input() canUpload: boolean;

  manufacturingForm: FormGroup;
  uploadedFiles: File[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private manufacturingService: ManufacturingService,
    private documentsService: DocumentsService
  ) {
  }

  ngOnInit() {
    this.manufacturingForm = this.formBuilder.group({
      comments: [''],
      documents: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.uploadedFiles = [];
  }

  onDocumentSelected(uploadedFiles: File[]) {
    this.manufacturingForm.get('documents').setValue(uploadedFiles);
  }

  onAddManufacturingDocument(): void {
    const manufacturingItem: Manufacturing = this.manufacturingForm.value;
    this.manufacturingService.addBackofficeDocument(
      this.requestId,
      this.requestPosition,
      manufacturingItem
    ).subscribe(
      (docs: ManufacturingDocument[]) => {
        this.manufacturingForm.reset();
        this.uploadedFiles = [];
        const positionDocs = this.requestPosition.manufacturingDocuments;
        for (const doc of docs) {
          positionDocs.push(doc);
        }
      }
    );
  }

  onDownloadFile(document: RequestDocument) {
    this.documentsService.downloadFile(document);
  }

  canSendFiles(): boolean {
    const comments: string = this.manufacturingForm.get('comments').value || '';
    return comments.trim().length > 0;
  }
}

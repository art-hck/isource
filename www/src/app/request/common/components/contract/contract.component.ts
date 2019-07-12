import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Contract } from "../../models/contract";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestPosition } from "../../models/request-position";
import { ContractService } from "../../services/contract.service";
import { RequestContract } from "../../models/request-contract";
import { DocumentsService } from "../../services/documents.service";
import { RequestDocument } from "../../models/request-document";

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnChanges, OnInit {
  @Input() requestId: Uuid;
  @Input() requestPosition: RequestPosition;
  @Input() isCustomerView: boolean;

  contractForm: FormGroup;
  contractItem: Contract;
  requestContract: RequestContract;
  uploadedFiles: File[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService,
    private documentsService: DocumentsService
  ) {
  }

  ngOnInit() {
    this.contractForm = this.formBuilder.group({
      comments: [''],
      documents: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getContractList();
    this.uploadedFiles = [];
  }

  getContractList() {
    if (this.isCustomerView) {
      this.contractService.getCustomerContract(this.requestId, this.requestPosition).subscribe(
        (data: any) => this.afterGetContract(data)
      );
    } else {
      this.contractService.getBackofficeContract(this.requestId, this.requestPosition).subscribe(
        (data: any) => this.afterGetContract(data)
      );
    }
  }

  onDocumentSelected(uploadedFiles: File[], contractForm) {
    contractForm.get('documents').setValue(uploadedFiles);
  }

  onAddContract() {
    this.contractItem = this.contractForm.value;
    return this.isCustomerView ?
      this.contractService.addCustomerContract(this.requestId, this.requestPosition, this.contractItem)
        .subscribe(() => this.afterAddContract()) :
      this.contractService.addBackofficeContract(this.requestId, this.requestPosition, this.contractItem)
        .subscribe(() => this.afterAddContract());
  }

  onDownloadFile(document: RequestDocument) {
    this.documentsService.downloadFile(document);
  }

  afterAddContract() {
    this.contractForm.reset();
    this.uploadedFiles = [];
    this.getContractList();
  }

  afterGetContract(data: any) {
    this.requestContract = data;
  }
}

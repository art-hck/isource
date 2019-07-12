import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Contract} from "../../models/contract";
import {Uuid} from "../../../../cart/models/uuid";
import {RequestPosition} from "../../models/request-position";
import {ContractService} from "../../services/contract.service";
import {RequestContract} from "../../models/request-contract";

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnChanges, OnInit {
  @Input() requestId: Uuid;
  @Input() requestPosition: RequestPosition;
  @Input() isCustomerView: boolean;

  @Output() downloadClick = new EventEmitter<File>();

  contractForm: FormGroup;
  contractItem: Contract;
  requestContract: RequestContract = null;
  uploadedFiles: File[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService
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
        (data: any) => {
          this.requestContract = data;
        }
      );
    } else {
      this.contractService.getBackofficeContract(this.requestId, this.requestPosition).subscribe(
        (data: any) => {
          this.requestContract = data;
        }
      );
    }
  }

  onDocumentSelected(uploadedFiles: File[], contractForm) {
    contractForm.get('documents').setValue(uploadedFiles);
  }

  onAddContract() {
    this.contractItem = this.contractForm.value;
    if (this.isCustomerView) {
      return this.contractService.addCustomerContract(this.requestId, this.requestPosition, this.contractItem).subscribe(
        (data: any) => {
          this.contractForm.reset();
          this.uploadedFiles = [];
          this.getContractList();
        }
      );
    } else {
      return this.contractService.addBackofficeContract(this.requestId, this.requestPosition, this.contractItem).subscribe(
        (data: any) => {
          this.contractForm.reset();
          this.uploadedFiles = [];
          this.getContractList();
        }
      );
    }
  }

  onDownloadFile() {
    this.downloadClick.emit(this.requestContract.documents[0]);
  }

}

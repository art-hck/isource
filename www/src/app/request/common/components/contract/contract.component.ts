import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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

  contractForm: FormGroup;
  contractItem: Contract;
  requestContract: RequestContract = null;
  documents: File[] = [];

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
    this.getCustomerContract();
    this.documents = [];
  }

  getCustomerContract() {
    if (this.isCustomerView) {
      this.contractService.getCustomerContract(this.requestId, this.requestPosition).subscribe(
        (data: any) => {
          this.requestContract = data;
        }
      );
    }
  }

  onDocumentSelected(documents: File[], contractForm) {
    contractForm.get('documents').setValue(documents);
  }

  onAddContract() {
    this.contractItem = this.contractForm.value;
    return this.contractService.addContract(this.requestId, this.requestPosition, this.contractItem).subscribe(
      (data: any) => {
        this.contractForm.reset();
        this.documents = [];
        this.getCustomerContract();
      }
    );
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Request} from "../../models/request";
import {RequestPositionWorkflowStepLabels} from "../../dictionaries/request-position-workflow-step-labels";
import {RequestTypes} from "../../enum/request-types";
import {DocumentsService} from "../../services/documents.service";

@Component({
  selector: 'app-request-info',
  templateUrl: './request-info.component.html',
  styleUrls: ['./request-info.component.css']
})
export class RequestInfoComponent implements OnInit {

  @Input() showRequestInfo = false;
  @Input() request: Request;
  @Input() isCustomerView: boolean;

  @Output() showPositionList = new EventEmitter<boolean>();

  requestPositionWorkflowStepLabels = Object.entries(RequestPositionWorkflowStepLabels);

  constructor(
    private documentsService: DocumentsService
  ) {
  }

  ngOnInit() {

  }

  checkIfFreeForm() {
    return this.request.type === RequestTypes.FREE_FORM;
  }

  onClose() {
    this.showRequestInfo = false;
  }

  onHiddenList() {
    this.showPositionList.emit();
  }

}

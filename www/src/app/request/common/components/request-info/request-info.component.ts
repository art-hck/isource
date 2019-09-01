import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Request} from "../../models/request";
import {RequestPositionWorkflowStepLabels} from "../../dictionaries/request-position-workflow-step-labels";
import {RequestTypes} from "../../enum/request-types";

@Component({
  selector: 'app-request-info',
  templateUrl: './request-info.component.html',
  styleUrls: ['./request-info.component.css']
})
export class RequestInfoComponent implements OnInit {

  @Output() close = new EventEmitter();

  @Input() request: Request;
  @Input() isCustomerView: boolean;

  @Input() fullScreen = false;
  @Output() fullScreenChange = new EventEmitter<boolean>();

  ngOnInit() {

  }

  checkIfFreeForm() {
    return this.request.type === RequestTypes.FREE_FORM;
  }

  onWindowClose() {
    this.close.emit();
  }

  onWindowFull(flag: boolean) {
    this.fullScreen = flag;
    this.fullScreenChange.emit(this.fullScreen);
  }
}

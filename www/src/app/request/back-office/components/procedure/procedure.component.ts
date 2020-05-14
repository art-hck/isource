import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Procedure } from "../../models/procedure";
import moment from "moment";
import { RequestDocument } from "../../../common/models/request-document";
import { APP_CONFIG, GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { Request } from "../../../common/models/request";

@Component({
  selector: 'app-request-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.scss']
})
export class ProcedureComponent {
  @Input() procedure: Procedure;
  @Input() request: Request;
  @Output() bargain = new EventEmitter();
  @Output() prolong = new EventEmitter();
  folded: boolean;

  get documents(): RequestDocument[] {
    return [...this.procedure?.procedureDocuments, ...this.procedure?.procedureLotDocuments];
  }

  get finished(): boolean {
    return moment(this.procedure?.dateEndRegistration).isBefore();
  }

  get link(): string {
    return this.appConfig.procedure.url + this.procedure.procedureId;
  }

  get resultLink(): string {
    return this.appConfig.procedure.resultUrl + this.procedure.lotId;
  }

  constructor(@Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface) {
  }
}

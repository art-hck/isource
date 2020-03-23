import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { of } from "rxjs";
import { mock } from "./mock";
import { delay } from "rxjs/operators";
import { TechnicalCommercialProposalPosition } from "../../common/models/technical-commercial-proposal-position";
import { RequestPosition } from "../../common/models/request-position";

@Injectable()
export class TechnicalCommercialProposalService {

  constructor(protected api: HttpClient) {}

  list(requestId: Uuid) {
    // const url = `requests/customer/${requestId}/technical-commercial-proposals`;
    // return this.api.get<TechnicalCommercialProposal[]>(url);
    return of(mock).pipe(delay(2500));
  }

  approve(requestId: Uuid, proposalPosition: TechnicalCommercialProposalPosition) {
    // const url = `requests/customer/${requestId}/technical-commercial-proposals/approve`;
    // return this.api.get<TechnicalCommercialProposal>(url);
    return of(mock).pipe(delay(1500));
  }

  reject(requestId: Uuid, position: RequestPosition) {
    // const url = `requests/customer/${requestId}/${position}/technical-commercial-proposal/reject`;
    // return this.api.get<TechnicalCommercialProposal>(url);
    return of(mock).pipe(delay(1500));
  }
}

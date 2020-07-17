import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { TechnicalCommercialProposalPosition } from "../../common/models/technical-commercial-proposal-position";
import { RequestPosition } from "../../common/models/request-position";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";

@Injectable()
export class TechnicalCommercialProposalService {

  constructor(protected api: HttpClient) {}

  list(requestId: Uuid) {
    const url = `requests/customer/${requestId}/technical-commercial-proposals`;
    return this.api.get<TechnicalCommercialProposal[]>(url);
  }

  approve(requestId: Uuid, proposalPosition: TechnicalCommercialProposalPosition) {
    const url = `requests/customer/technical-commercial-proposal-positions/${proposalPosition.id}/choose-winner`;
    return this.api.post<TechnicalCommercialProposal>(url, { requestPositionId: proposalPosition.position.id });
  }

  sendToEditMultiple(positionIds: Uuid[]) {
    const url = `requests/customer/technical-commercial-proposal-positions/sent-to-edit`;
    return this.api.post<TechnicalCommercialProposalPosition[]>(url, { positionIds });
  }

  processMultiple(data: { accepted: Uuid[], sendToEdit: Uuid[] }) {
    const url = `requests/customer/technical-commercial-proposal-positions/change-statuses`;
    return this.api.post<TechnicalCommercialProposalPosition[]>(url, data);
  }

  reject(requestId: Uuid, position: RequestPosition) {
    // const url = `requests/customer/${requestId}/${position}/technical-commercial-proposal/reject`;
    // return this.api.get<TechnicalCommercialProposal>(url);
    return of(null).pipe(delay(1500));
  }
}

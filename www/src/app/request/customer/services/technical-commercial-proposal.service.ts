import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { of } from "rxjs";
import { delay, map, switchMap } from "rxjs/operators";
import { TechnicalCommercialProposalPosition } from "../../common/models/technical-commercial-proposal-position";
import { RequestPosition } from "../../common/models/request-position";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalPositionStatus } from "../../common/enum/technical-commercial-proposal-position-status";

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

  approveMultiple(positions: Uuid[]) {
    const url = `requests/customer/technical-commercial-proposal-positions/choose-winners`;
    return this.api.post<TechnicalCommercialProposal[]>(url, { positions });
  }

  sendToEditMultiple(positionIds: Uuid[]) {
    const url = `requests/customer/technical-commercial-proposal-positions/sent-to-edit`;
    return this.api.post<TechnicalCommercialProposalPosition[]>(url, { positionIds });
  }

  reject(requestId: Uuid, position: RequestPosition) {
    // const url = `requests/customer/${requestId}/${position}/technical-commercial-proposal/reject`;
    // return this.api.get<TechnicalCommercialProposal>(url);
    return of(null).pipe(delay(1500));
  }
}

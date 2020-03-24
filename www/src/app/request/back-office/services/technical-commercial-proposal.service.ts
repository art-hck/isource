import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Uuid } from "../../../cart/models/uuid";
import { Guid } from "guid-typescript";
import { RequestPosition } from "../../common/models/request-position";
import { TechnicalCommercialProposalStatus } from "../../common/enum/technical-commercial-proposal-status";
import { TechnicalCommercialProposalStatusLabel } from "../../common/enum/technical-commercial-proposal-status-label";

@Injectable()
export class TechnicalCommercialProposalService {

  constructor(protected api: HttpClient) {}

  list(requestId: Uuid) {
    const url = `requests/backoffice/${requestId}/technical-commercial-proposals`;
    return this.api.get<TechnicalCommercialProposal[]>(url);
  }

  create(requestId: Uuid, body: Partial<TechnicalCommercialProposal>) {
    return of({id: Guid.create().toString(), ...body}).pipe(this.delayPipe(300, 1200)) as Observable<TechnicalCommercialProposal>;
  }

  update(requestId: Uuid, body: Partial<TechnicalCommercialProposal> & {id: Uuid}) {
    return of(body).pipe(this.delayPipe(300, 1200)) as Observable<TechnicalCommercialProposal>;
  }

  publish(requestId: Uuid, proposal: TechnicalCommercialProposal) {
    return of(null).pipe(
      this.delayPipe(1300, 2200),
      map(() => ({
        ...proposal,
        status: TechnicalCommercialProposalStatus.SENT_TO_REVIEW,
        statusLabel: TechnicalCommercialProposalStatusLabel.SENT_TO_REVIEW
      }))
    ) as Observable<TechnicalCommercialProposal>;
  }

  availablePositions(requestId: Uuid) {
    const url = `requests/backoffice/${requestId}/technical-commercial-proposals/available-request-positions`;
    return this.api.get<RequestPosition[]>(url);
  }

  private delayPipe(min, max) {
    return delay(Math.floor(min + Math.random() * (max + 1 - min)));
  }
}

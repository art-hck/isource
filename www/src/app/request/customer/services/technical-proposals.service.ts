import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import {TechnicalProposalPosition} from "../../common/models/technical-proposal-position";
import { TechnicalProposal } from "../../common/models/technical-proposal";

@Injectable({
  providedIn: "root"
})
export class TechnicalProposalsService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  getTechnicalProposalsList(requestId: Uuid) {
    const url = `requests/customer/${requestId}/technical-proposals`;
    return this.api.get<TechnicalProposal[]>(url);
  }

  acceptTechnicalProposals(requestId: Uuid, technicalProposalId: Uuid, technicalProposalsPositions: TechnicalProposalPosition[]) {
    const url = `requests/customer/${requestId}/technical-proposals/${technicalProposalId}/accept`;
    const ids = [];
    for (const technicalProposalsPosition of technicalProposalsPositions) {
      ids.push(technicalProposalsPosition.id);
    }
    return this.api.post(url, {
      positions: ids
    });
  }

  declineTechnicalProposals(requestId: Uuid, technicalProposalId: Uuid, technicalProposalsPositions: TechnicalProposalPosition[]) {
    const url = `requests/customer/${requestId}/technical-proposals/${technicalProposalId}/decline`;
    const ids = [];
    for (const technicalProposalsPosition of technicalProposalsPositions) {
      ids.push(technicalProposalsPosition.id);
    }
    return this.api.post(url, {
      positions: ids
    });
  }
}

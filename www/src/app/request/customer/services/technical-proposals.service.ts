import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import {TechnicalProposalPosition} from "../../common/models/technical-proposal-position";
import { TechnicalProposal } from "../../common/models/technical-proposal";
import { Observable } from "rxjs";
import { TechnicalProposalFilter } from "../../common/models/technical-proposal-filter";
import { TechnicalProposalsStatus } from "../../common/enum/technical-proposals-status";

@Injectable({
  providedIn: "root"
})
export class TechnicalProposalsService {

  constructor(private api: HttpClient) {}

  list(requestId: Uuid, filters: TechnicalProposalFilter): Observable<TechnicalProposal[]> {
    const url = `requests/customer/${requestId}/technical-proposals`;
    return this.api.post<TechnicalProposal[]>(url, { filters });
  }

  // @TODO: ждём реализацию на бэкенде (gpn_market-2870)
  // availableFilters(requestId: Uuid) {
  //   const url = `requests/customer/${requestId}/technical-proposals/available-filters`;
  //   return this.api.get<TechnicalProposalFilter>(url);
  // }

  accept(requestId: Uuid, technicalProposalId: Uuid, technicalProposalsPositions: TechnicalProposalPosition[]) {
    const url = `requests/customer/${requestId}/technical-proposals/${technicalProposalId}/accept`;
    return this.api.post(url, { positions: technicalProposalsPositions.map(({id}) => id) });
  }

  reject(requestId: Uuid, technicalProposalId: Uuid, technicalProposalsPositions: TechnicalProposalPosition[], comment) {
    const url = `requests/customer/${requestId}/technical-proposals/${technicalProposalId}/decline`;
    return this.api.post(url, { positions: technicalProposalsPositions.map(({id}) => id), comment });
  }

  sendToEdit(requestId: Uuid, technicalProposalId: Uuid, technicalProposalsPositions: TechnicalProposalPosition[], comment) {
    const url = `requests/customer/${requestId}/technical-proposals/${technicalProposalId}/send-to-edit-positions`;
    return this.api.post(url, { positions: technicalProposalsPositions.map(({id}) => id), comment });
  }
}

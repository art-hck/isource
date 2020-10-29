import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { PositionsWithSuppliers } from "../../back-office/models/positions-with-suppliers";
import { CommercialProposalReviewBody } from "../../common/models/commercial-proposal-review-body";
import { ProposalGroup } from "../../common/models/proposal-group";
import { CommercialProposalGroupFilter } from "../../common/models/commercial-proposal-group-filter";


@Injectable({
  providedIn: "root"
})
export class CommercialProposalsService {

  constructor(private api: HttpClient) {}

  group(requestId: Uuid, groupId: Uuid) {
    const url = `requests/customer/${ requestId }/commercial-proposal-groups/${ groupId }/view`;
    return this.api.get<ProposalGroup>(url);
  }

  groupList(requestId: Uuid, filters: CommercialProposalGroupFilter = {}) {
    const url = `requests/customer/${ requestId }/commercial-proposal-groups`;
    return this.api.post<ProposalGroup[]>(url, { filters });
  }

  positionsWithOffers(requestId: Uuid, groupId: Uuid) {
    const url = `requests/customer/${requestId}/positions-with-offers`;
    return this.api.post<PositionsWithSuppliers>(url, { requestCommercialProposalGroupId: groupId });
  }

  review(requestId: Uuid, body: CommercialProposalReviewBody) {
    const url = `requests/customer/${requestId}/commercial-proposals/change-statuses`;
    return this.api.post(url, body);
  }

  downloadAnalyticalReport(requestId: Uuid, groupId: Uuid) {
    const url = `requests/customer/${ requestId }/analytic-report/download-by-cp`;
    return this.api.post(url, { requestCommercialProposalGroupId: groupId }, { responseType: 'blob' });
  }
}

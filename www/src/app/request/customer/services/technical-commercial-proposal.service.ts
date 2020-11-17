import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { TechnicalCommercialProposalPosition } from "../../common/models/technical-commercial-proposal-position";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { ProposalGroup } from "../../common/models/proposal-group";
import { TechnicalCommercialProposalGroupFilter } from "../../common/models/technical-commercial-proposal-group-filter";
import { CommonProposalPayload } from "../../common/models/common-proposal";

@Injectable()
export class TechnicalCommercialProposalService {

  constructor(protected api: HttpClient) {}

  list(requestId: Uuid, body: { requestTechnicalCommercialProposalGroupId: Uuid }) {
    const url = `requests/customer/${requestId}/technical-commercial-proposals`;
    return this.api.post<CommonProposalPayload>(url, body);
  }

  groupList(requestId: Uuid, filters: TechnicalCommercialProposalGroupFilter = {}) {
    const url = `requests/customer/${requestId}/technical-commercial-proposal-groups`;
    return this.api.post<ProposalGroup[]>(url, { filters });
  }

  getGroupInfo(requestId: Uuid, groupId: Uuid) {
    const url = `requests/customer/${ requestId }/technical-commercial-proposal-groups/${ groupId }/view`;
    return this.api.get<ProposalGroup>(url);
  }

  approve(requestId: Uuid, proposalPosition: TechnicalCommercialProposalPosition) {
    const url = `requests/customer/technical-commercial-proposal-positions/${proposalPosition.id}/choose-winner`;
    return this.api.post<TechnicalCommercialProposal>(url, { requestPositionId: proposalPosition.position.id });
  }

  sendToEditMultiple(positionIds: Uuid[]) {
    const url = `requests/customer/technical-commercial-proposal-positions/sent-to-edit`;
    return this.api.post<TechnicalCommercialProposalPosition[]>(url, { positionIds });
  }

  reviewMultiple(data: { accepted: Uuid[], sendToEdit: Uuid[] }) {
    const url = `requests/customer/technical-commercial-proposal-positions/change-statuses`;
    return this.api.post<TechnicalCommercialProposalPosition[]>(url, data);
  }

  downloadAnalyticalReport(requestId: Uuid, groupId: Uuid) {
    const url = `requests/customer/${ requestId }/analytic-report/download-by-tcp`;
    return this.api.post(url, { requestTechnicalCommercialProposalGroupId: groupId }, { responseType: 'blob' });
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { TechnicalCommercialProposalPosition } from "../../common/models/technical-commercial-proposal-position";
import { ProposalGroup } from "../../common/models/proposal-group";
import { CommonProposalPayload } from "../../common/models/common-proposal";
import { ProposalGroupFilter } from "../../common/models/proposal-group-filter";

@Injectable()
export class TechnicalCommercialProposalService {

  constructor(protected api: HttpClient) {}

  list(requestId: Uuid, groupId: Uuid) {
    const url = `requests/customer/${requestId}/technical-commercial-proposals`;
    return this.api.post<CommonProposalPayload>(url, { requestTechnicalCommercialProposalGroupId: groupId });
  }

  review(data: { accepted: Uuid[], sendToEdit: Uuid[] }) {
    const url = `requests/customer/technical-commercial-proposal-positions/change-statuses`;
    return this.api.post<CommonProposalPayload>(url, data);
  }

  group(requestId: Uuid, groupId: Uuid) {
    const url = `requests/customer/${ requestId }/technical-commercial-proposal-groups/${ groupId }/view`;
    return this.api.get<ProposalGroup>(url);
  }

  groupList(requestId: Uuid, filters: ProposalGroupFilter = {}) {
    const url = `requests/customer/${ requestId }/technical-commercial-proposal-groups`;
    return this.api.post<ProposalGroup[]>(url, { filters });
  }

  downloadAnalyticalReport(requestId: Uuid, groupId: Uuid) {
    const url = `requests/customer/${ requestId }/analytic-report/download-by-tcp`;
    return this.api.post(url, { requestTechnicalCommercialProposalGroupId: groupId }, { responseType: 'blob' });
  }
}

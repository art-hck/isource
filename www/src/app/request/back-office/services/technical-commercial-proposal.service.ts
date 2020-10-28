import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "../../common/models/request-position";
import { FormDataService } from "../../../shared/services/form-data.service";
import { TechnicalCommercialProposalPosition } from "../../common/models/technical-commercial-proposal-position";
import { ProposalGroup } from "../../common/models/proposal-group";
import { TechnicalCommercialProposalGroupFilter } from "../../common/models/technical-commercial-proposal-group-filter";

@Injectable()
export class TechnicalCommercialProposalService {

  constructor(protected api: HttpClient, private formDataService: FormDataService) {}

  list(requestId: Uuid, body: { requestTechnicalCommercialProposalGroupId: Uuid }) {
    const url = `requests/backoffice/${ requestId }/technical-commercial-proposals`;
    return this.api.post<TechnicalCommercialProposal[]>(url, body);
  }

  create(requestId: Uuid, groupId: Uuid, body: Partial<TechnicalCommercialProposal>) {
    const url = `requests/backoffice/${ requestId }/technical-commercial-proposals/create`;
    return this.api.post<TechnicalCommercialProposal>(url, this.formDataService.toFormData({
      ...body,
      requestTechnicalCommercialProposalGroupId: groupId
    }));
  }

  update(proposal: Partial<TechnicalCommercialProposal> & { id: Uuid }) {
    const url = `requests/backoffice/technical-commercial-proposals/${ proposal.id }/edit`;
    return this.api.post<TechnicalCommercialProposal>(url, this.formDataService.toFormData(proposal));
  }

  updateParams(requestId: Uuid, proposal: Partial<TechnicalCommercialProposal> & {id: Uuid}) {
    const url = `requests/backoffice/technical-commercial-proposals/${requestId}/edit-params`;
    return this.api.post<TechnicalCommercialProposal>(url, this.formDataService.toFormData(proposal));
  }

  getGroupInfo(requestId: Uuid, groupId: Uuid) {
    const url = `requests/backoffice/${ requestId }/technical-commercial-proposal-groups/${ groupId }/view`;
    return this.api.get<ProposalGroup>(url);
  }

  publish({ id }: TechnicalCommercialProposal) {
    const url = `requests/backoffice/technical-commercial-proposals/${ id }/send-to-review`;
    return this.api.get<TechnicalCommercialProposal>(url);
  }

  publishPositions(positionIds: Uuid[]) {
    const url = `requests/backoffice/technical-commercial-proposals/send-positions-to-review`;
    return this.api.post<TechnicalCommercialProposalPosition[]>(url, { positionIds });
  }

  groupList(requestId: Uuid, filters: TechnicalCommercialProposalGroupFilter = {}) {
    const url = `requests/backoffice/${ requestId }/technical-commercial-proposal-groups`;
    return this.api.post<ProposalGroup[]>(url, { filters });
  }

  groupCreate(requestId: Uuid, body: { name: string, requestPositions: Uuid[] }) {
    const url = `requests/backoffice/${ requestId }/technical-commercial-proposal-groups/create`;
    return this.api.post<ProposalGroup>(url, body);
  }

  groupUpdate(requestId: Uuid, groupId: Uuid, body: { name: string, requestPositions: Uuid[] }) {
    const url = `requests/backoffice/${ requestId }/technical-commercial-proposal-groups/${ groupId }/edit`;
    return this.api.post<ProposalGroup>(url, body);
  }

  downloadTemplate(requestId: Uuid, groupId: Uuid) {
    const data = groupId ? {
      requestTechnicalCommercialProposalGroupId: groupId
    } : {};

    const url = `requests/backoffice/${ requestId }/technical-commercial-proposals/download-excel-template`;
    return this.api.post(url, data, { responseType: 'blob' });
  }

  uploadTemplate(requestId: Uuid, requestTechnicalCommercialProposalGroupId: Uuid, files: File[]) {
    const url = `requests/backoffice/${ requestId }/technical-commercial-proposals/upload-excel`;
    const data = { files, requestTechnicalCommercialProposalGroupId };

    return this.api.post<TechnicalCommercialProposal[]>(url, this.formDataService.toFormData(data));
  }

  uploadTemplateFromGroups(requestId: Uuid, files: File[], requestTechnicalCommercialProposalGroupName: string) {
    const url = `requests/backoffice/${ requestId }/technical-commercial-proposal-groups/upload-excel`;
    const data = { files, requestTechnicalCommercialProposalGroupName };

    return this.api.post<ProposalGroup>(url, this.formDataService.toFormData(data));
  }

  downloadAnalyticalReport(requestId: Uuid, groupId: Uuid) {
    const url = `requests/backoffice/${ requestId }/analytic-report/download-by-tcp`;
    return this.api.post(url, { requestTechnicalCommercialProposalGroupId: groupId }, { responseType: 'blob' });
  }

  availablePositions(requestId: Uuid, groupId?: Uuid) {
    const url = `requests/backoffice/${ requestId }/technical-commercial-proposals/available-request-positions`;
    return this.api.post<RequestPosition[]>(url, { requestTechnicalCommercialProposalGroupId: groupId });
  }

  rollback(requestId: Uuid, positionId: Uuid) {
    const url = `requests/backoffice/${ requestId }/technical-commercial-proposals/cancel-publish`;
    return this.api.post<TechnicalCommercialProposalPosition[]>(url, { positionId });
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "../../common/models/request-position";
import { FormDataService } from "../../../shared/services/form-data.service";
import { TechnicalCommercialProposalPosition } from "../../common/models/technical-commercial-proposal-position";
import { Procedure } from "../models/procedure";

@Injectable()
export class TechnicalCommercialProposalService {

  constructor(protected api: HttpClient, private formDataService: FormDataService) {}

  list(requestId: Uuid) {
    const url = `requests/backoffice/${requestId}/technical-commercial-proposals`;
    return this.api.get<TechnicalCommercialProposal[]>(url);
  }

  create(requestId: Uuid, body: Partial<TechnicalCommercialProposal>) {
    const url = `requests/backoffice/${requestId}/technical-commercial-proposals/create`;
    return this.api.post<TechnicalCommercialProposal>(url, this.formDataService.toFormData(body));
  }

  update(proposal: Partial<TechnicalCommercialProposal> & {id: Uuid}) {
    const url = `requests/backoffice/technical-commercial-proposals/${proposal.id}/edit`;
    return this.api.post<TechnicalCommercialProposal>(url, this.formDataService.toFormData(proposal));
  }

  publish({id}: TechnicalCommercialProposal) {
    const url = `requests/backoffice/technical-commercial-proposals/${id}/send-to-review`;
    return this.api.get<TechnicalCommercialProposal>(url);
  }

  publishPositions(positionIds: Uuid[]) {
    const url = `requests/backoffice/technical-commercial-proposals/send-positions-to-review`;
    return this.api.post<TechnicalCommercialProposalPosition[]>(url, { positionIds });
  }

  downloadTemplate(requestId: Uuid) {
    const url = `requests/backoffice/${requestId}/technical-commercial-proposals/download-excel-template`;
    return this.api.post(url, {}, {responseType: 'blob'});
  }

  uploadTemplate(requestId: Uuid, files: File[]) {
    const url = `requests/backoffice/${requestId}/technical-commercial-proposals/upload-excel`;
    return this.api.post<TechnicalCommercialProposal[]>(url, this.formDataService.toFormData({files}));
  }

  downloadAnalyticalReport(requestId: Uuid) {
    const url = `requests/backoffice/${requestId}/analytic-report/download-by-tcp`;
    return this.api.post(url, {}, {responseType: 'blob'});
  }

  availablePositions(requestId: Uuid) {
    const url = `requests/backoffice/${requestId}/technical-commercial-proposals/available-request-positions`;
    return this.api.get<RequestPosition[]>(url);
  }

  procedures(requestId: Uuid) {
    const url = `requests/backoffice/${requestId}/technical-commercial-proposals/procedures`;
    return this.api.get<Procedure[]>(url);
  }

  rollback(requestId: Uuid, positionId: Uuid) {
    const url = `requests/backoffice/${requestId}/technical-commercial-proposals/cancel-publish`;
    return this.api.post<TechnicalCommercialProposalPosition[]>(url, { positionId });
  }
}

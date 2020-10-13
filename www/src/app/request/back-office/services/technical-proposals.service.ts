import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { TechnicalProposal } from "../../common/models/technical-proposal";
import { Observable } from "rxjs";
import { RequestPosition } from "../../common/models/request-position";
import { TechnicalProposalCreateRequest } from "../models/technical-proposal-create-request";
import { saveAs } from 'file-saver/src/FileSaver';
import { TechnicalProposalsStatus } from "../../common/enum/technical-proposals-status";
import { TechnicalProposalFilter } from "../../common/models/technical-proposal-filter";
import { FormDataService } from "../../../shared/services/form-data.service";
import { TechnicalProposalWithPositions } from "../models/technical-proposal-with-positions";
import { map } from "rxjs/operators";

@Injectable()
export class TechnicalProposalsService {

  constructor(private api: HttpClient, private formDataService: FormDataService) {}

  getTechnicalProposalsList(requestId: Uuid, filters: TechnicalProposalFilter) {
    const url = `requests/backoffice/${requestId}/technical-proposals`;
    return this.api.post<TechnicalProposal[]>(url, { filters });
  }

  // @TODO: ждём реализацию на бэкенде (gpn_market-2870)
  // availableFilters(requestId: Uuid): Observable<TechnicalProposalFilter> {
  availableFilters(tpList$: Observable<TechnicalProposal[]>): Observable<TechnicalProposalFilter> {
    // const url = `requests/backoffice/${requestId}/technical-proposals`;
    // return this.api.get<TechnicalProposal[]>(url).pipe(
    return tpList$.pipe(
      map(proposals => proposals.reduce<TechnicalProposalFilter>((acc, curr, i, arr) => ({
        ...acc,
        contragents: arr.findIndex(({ supplierContragent }) => supplierContragent === curr.supplierContragent) === i ?
          [...acc.contragents ?? [], curr.supplierContragent] : acc.contragents,
        tpStatus: arr.findIndex(({ status }) => status === curr.status) === i ?
          [...acc.tpStatus ?? [], curr.status] : acc.tpStatus
      }), {})
    ));
  }

  getTechnicalProposalsAvailableStatuses(requestId: Uuid, filters: TechnicalProposalFilter) {
    const url = `requests/backoffice/${requestId}/technical-proposals/available-statuses`;
    return this.api.post<TechnicalProposalsStatus[]>(url, { filters });
  }

  getTechnicalProposalsPositionsList(id: Uuid) {
    const url = `requests/backoffice/${id}/technical-proposals/positions`;
    return this.api.get<RequestPosition[]>(url);
  }

  addTechnicalProposal(requestId: Uuid, technicalProposal: TechnicalProposalCreateRequest) {
    const url = `requests/backoffice/${requestId}/technical-proposals/create`;
    return this.api.post<TechnicalProposal>(url, technicalProposal);
  }

  updateTechnicalProposal(requestId: Uuid, technicalProposal: TechnicalProposalCreateRequest) {
    const url = `requests/backoffice/${requestId}/technical-proposals/edit`;
    return this.api.post<TechnicalProposal>(url, technicalProposal);
  }

  uploadSelectedDocuments(requestId: Uuid, tpId: Uuid, formData) {
    const url = `requests/backoffice/${requestId}/technical-proposals/${tpId}/upload-documents`;
    return this.api.post(url, formData);
  }

  updateTpPositionManufacturingName(requestId: Uuid, tpId: Uuid, technicalProposal) {
    const url = `requests/backoffice/${requestId}/technical-proposals/${tpId}/update-manufacturing-name`;
    return this.api.post(url, technicalProposal);
  }

  sendToAgreement(requestId: Uuid, technicalProposal: TechnicalProposal) {
    const url = `requests/backoffice/${requestId}/technical-proposals/${technicalProposal.id}/send-to-agreement`;
    return this.api.post(url, technicalProposal);
  }

  cancelSendToAgreement(requestId: Uuid, technicalProposal: TechnicalProposal): Observable<TechnicalProposal> {
    const url = `requests/backoffice/${requestId}/technical-proposals/${technicalProposal.id}/cancel-send-to-agreement`;
    return this.api.post<TechnicalProposal>(url, technicalProposal);
  }

  downloadTemplate(requestId: Uuid, contragentId: Uuid) {
    const url = `requests/backoffice/${requestId}/technical-proposals/download-excel-template`;
    return this.api.post(url, {supplierContragentId: contragentId}, {responseType: 'blob'}).subscribe(data => {
      saveAs(data, `RequestTechnicalProposalsTemplate.xlsx`);
    });
  }

  addPositionsFromExcel(requestId: Uuid, files: File[]) {
    const url = `requests/backoffice/${requestId}/technical-proposals/upload-excel`;

    return this.api.post<TechnicalProposalWithPositions>(url, this.formDataService.toFormData({ files }));
  }
}

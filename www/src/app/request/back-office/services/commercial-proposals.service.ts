import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { RequestOfferPosition } from "../../common/models/request-offer-position";
import { Observable, of } from "rxjs";
import { RequestDocument } from "../../common/models/request-document";
import { RequestPosition } from "../../common/models/request-position";
import { ContragentList } from 'src/app/contragent/models/contragent-list';
import { PositionsWithSuppliers } from "../models/positions-with-suppliers";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";
import { ProposalGroup } from "../../common/models/proposal-group";
import { CommercialProposalGroupFilter } from "../../common/models/commercial-proposal-group-filter";
import { ProposalGroups } from "./mock";
import { FormDataService } from "../../../shared/services/form-data.service";

@Injectable({
  providedIn: "root"
})
export class CommercialProposalsService {

  constructor(private api: HttpClient, private formData: FormDataService) {
  }

  getOffers(id: Uuid, groupId: Uuid) {
    const url = `requests/backoffice/${ id }/commercial-proposals`;
    return this.api.post<PositionsWithSuppliers>(url, { requestCommercialProposalGroupId: groupId });
  }

  availablePositions(id: Uuid) {
    const url = `requests/backoffice/${ id }/commercial-proposals/available-request-positions`;
    return this.api.get<RequestPosition[]>(url);
  }

  group(requestId: Uuid, groupId: Uuid) {
    const url = `requests/backoffice/${ requestId }/commercial-proposal-groups/${ groupId }/view`;
    return this.api.get<ProposalGroup>(url);
  }

  groupList(requestId: Uuid, filters: CommercialProposalGroupFilter = {}) {
    const url = `requests/backoffice/${ requestId }/commercial-proposal-groups`;
    return this.api.post<ProposalGroup[]>(url, { filters });
  }

  groupCreate(requestId: Uuid, body: { name: string, requestPositions: Uuid[] }) {
    const url = `requests/backoffice/${ requestId }/commercial-proposal-groups/create`;
    return this.api.post<ProposalGroup>(url, body);
  }

  groupUpdate(requestId: Uuid, groupId: Uuid, body: { name: string, requestPositions: Uuid[] }) {
    const url = `requests/backoffice/${ requestId }/commercial-proposal-groups/${ groupId }/edit`;
    return this.api.post<ProposalGroup>(url, body);
  }

  addSupplier(id: Uuid, groupId: Uuid, supplierId: Uuid) {
    const url = `requests/backoffice/${ id }/commercial-proposals/add-supplier`;
    return this.api.post<ContragentShortInfo[]>(url, { supplierId, requestCommercialProposalGroupId: groupId });
  }

  addOffer(id: Uuid, positionId: Uuid, offer: RequestOfferPosition) {
    const url = `requests/backoffice/${ id }/positions/${ positionId }/add-offer`;
    return this.api.post<RequestOfferPosition>(url, this.formData.toFormData(offer));
  }

  editOffer(id: Uuid, positionId: Uuid, editedOffer: RequestOfferPosition) {
    const url = `requests/backoffice/${ id }/positions/${ positionId }/edit-offer`;
    return this.api.post<RequestOfferPosition>(url, this.formData.toFormData(editedOffer));
  }

  publishOffers(id: Uuid, positionId) {
    const url = `requests/backoffice/${ id }/positions/${ positionId }/publish-offers`;
    return this.api.post(url, {});
  }

  publishRequestOffers(id: Uuid, requestPositions: RequestPosition[]) {
    const url = `requests/backoffice/${ id }/publish-offers`;
    const positionIds = requestPositions.map(item => item.id);

    return this.api.post(url, { positionIds });
  }

  rollback(id: Uuid, positionId: Uuid): Observable<RequestPosition> {
    const url = `requests/backoffice/${ id }/cancel-publish-offers`;
    return this.api.post<RequestPosition>(url, { positionId });
  }

  uploadDocuments(offer: RequestOfferPosition, files: File[]): Observable<RequestDocument[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file, file.name);
    });

    const url = `requests/backoffice/offers/${ offer.id }/documents/upload`;
    return this.api.post<RequestDocument[]>(url, formData);
  }

  /**
   * @deprecated
   */
  uploadTechnicalProposals(offer: RequestOfferPosition, files: File[]): Observable<RequestDocument[]> {
    const url = `requests/backoffice/offers/${ offer.id }/technical-proposals/upload`;
    return this.api.post<RequestDocument[]>(url, this.formData.toFormData({ files }));
  }

  downloadTemplate(requestId: Uuid, groupId: Uuid) {
    const url = `requests/backoffice/${ requestId }/download-offers-template`;
    return this.api.post(url, { requestCommercialProposalGroupId: groupId }, { responseType: 'blob' });
  }

  addOffersFromExcel(requestId: Uuid, files: File[], groupId?: Uuid, commercialProposalGroupName?: string) {
    const url = `requests/backoffice/${ requestId }/add-offers-from-excel`;
    const data = { files, requestCommercialProposalGroupId: groupId, commercialProposalGroupName };
    return this.api.post(url, this.formData.toFormData(data));
  }

  getContragentsWithTp(requestId: Uuid, positions: Uuid[]) {
    const url = `requests/backoffice/${ requestId }/contragents-with-tp`;
    return this.api.post<ContragentList[]>(url, { positions });
  }

  prolongateProcedureEndDate(requestId, procedureId, dateEndRegistration, dateSummingUp) {
    const url = `requests/backoffice/${ requestId }/procedures/${ procedureId }/prolong`;
    return this.api.post(url, { dateEndRegistration, dateSummingUp });
  }

  downloadAnalyticalReport(requestId: Uuid, groupId: Uuid) {
    const url = `requests/backoffice/${ requestId }/analytic-report/download-by-cp`;
    return this.api.post(url, { requestCommercialProposalGroupId: groupId }, { responseType: 'blob' });
  }
}

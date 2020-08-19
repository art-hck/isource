import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { RequestOfferPosition } from "../../common/models/request-offer-position";
import { Observable } from "rxjs";
import { RequestDocument } from "../../common/models/request-document";
import { Request } from "../../common/models/request";
import { saveAs } from 'file-saver/src/FileSaver';
import { RequestPosition } from "../../common/models/request-position";
import { ContragentList } from 'src/app/contragent/models/contragent-list';
import { PositionsWithSuppliers } from "../models/positions-with-suppliers";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";

@Injectable({
  providedIn: "root"
})
export class CommercialProposalsService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  getOffers(id: Uuid) {
    const url = `requests/backoffice/${id}/commercial-proposals`;
    return this.api.get<PositionsWithSuppliers>(url);
  }

  addSupplier(id: Uuid, supplierId: Uuid) {
    const url = `requests/backoffice/${id}/commercial-proposals/add-supplier`;
    return this.api.post<ContragentShortInfo[]>(url, { supplierId });
  }

  addOffer(id: Uuid, positionId, offer: RequestOfferPosition) {
    const url = `requests/backoffice/${id}/positions/${positionId}/add-offer`;
    return this.api.post<RequestOfferPosition>(url, this.convertModelToFormData(offer));
  }

  editOffer(id: Uuid, positionId, editedOffer: RequestOfferPosition) {
    const url = `requests/backoffice/${id}/positions/${positionId}/edit-offer`;
    return this.api.post<RequestOfferPosition>(url, this.convertModelToFormData(editedOffer));
  }

  publishOffers(id: Uuid, positionId) {
    const url = `requests/backoffice/${id}/positions/${positionId}/publish-offers`;
    return this.api.post(url, {});
  }

  publishRequestOffers(id: Uuid, requestPositions: RequestPosition[]) {
    const url = `requests/backoffice/${id}/publish-offers`;
    const positionIds = requestPositions.map(item => item.id);

    return this.api.post(url, { positionIds });
  }

  rollback(id: Uuid, positionId: Uuid): Observable<RequestPosition> {
    const url = `requests/backoffice/${id}/cancel-publish-offers`;
    return this.api.post<RequestPosition>(url, { positionId });
  }

  uploadDocuments(offer: RequestOfferPosition, files: File[]): Observable<RequestDocument[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file, file.name);
    });

    const url = `requests/backoffice/offers/${offer.id}/documents/upload`;
    return this.api.post<RequestDocument[]>(url, formData);
  }

  uploadTechnicalProposals(offer: RequestOfferPosition, files: File[]): Observable<RequestDocument[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file, file.name);
    });

    const url = `requests/backoffice/offers/${offer.id}/technical-proposals/upload`;
    return this.api.post<RequestDocument[]>(url, formData);
  }

  downloadOffersTemplate(request: Request): void {
    this.api.post(
      `requests/backoffice/${request.id}/download-offers-template`,
      {},
      {responseType: 'blob'})
      .subscribe(data => {
        saveAs(data, `Request${request.number}OffersTemplate.xlsx`);
      });
  }

  downloadTemplate(request: Request) {
    const url = `requests/backoffice/${request.id}/download-offers-template`;
    return this.api.post(url, {}, {responseType: 'blob'});
  }

  addOffersFromExcel(requestId: Uuid, files: File[]): Observable<any> {
    return this.api.post(
      `requests/backoffice/${requestId}/add-offers-from-excel`,
      this.convertModelToFormData(files, null, 'files')
    );
  }

  getContragentsWithTp(requestId: Uuid, positions: Uuid[]) {
    const url = `requests/backoffice/${requestId}/contragents-with-tp`;
    return this.api.post<ContragentList[]>(url, {positions});
  }

  /**
   * Функция для преобразования формы в FormData, при котором можно отправлять файлы
   *
   * @param model
   * @param form
   * @param namespace
   */
  convertModelToFormData(model: any, form: FormData = null, namespace = ''): FormData {
    const formData = form || new FormData();

    if (model instanceof File) {
      formData.append(namespace, model);
      return formData;
    }

    for (const propertyName in model) {
      if (!model.hasOwnProperty(propertyName) || !model[propertyName]) {
        continue;
      }

      const formKey = namespace ? `${namespace}[${propertyName}]` : propertyName;

      if (model[propertyName] instanceof Date) {
        formData.append(formKey, model[propertyName].toISOString());
      } else if (model[propertyName] instanceof Array) {
        model[propertyName].forEach((element, index) => {
          const tempFormKey = `${formKey}[${index}]`;
          this.convertModelToFormData(element, formData, tempFormKey);
        });
      } else if (model[propertyName] instanceof File) {
        formData.append(formKey, model[propertyName]);
      } else if (typeof model[propertyName] === 'object') {
        this.convertModelToFormData(model[propertyName], formData, formKey);
      } else {
        formData.append(formKey, model[propertyName].toString());
      }
    }

    return formData;
  }

  prolongateProcedureEndDate(requestId, procedureId, dateEndRegistration, dateSummingUp) {
    const url = `requests/backoffice/${requestId}/procedures/${procedureId}/prolong`;
    return this.api.post(url, { dateEndRegistration, dateSummingUp });
  }

  downloadAnalyticalReport(requestId: Uuid) {
    const url = `requests/backoffice/${requestId}/analytic-report/download-by-cp`;
    return this.api.post(url, {}, {responseType: 'blob'});
  }
}

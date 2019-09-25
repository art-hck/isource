import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { RequestOfferPosition } from "../../common/models/request-offer-position";
import { Observable } from "rxjs";
import { RequestDocument } from "../../common/models/request-document";
import { Request } from "../../common/models/request";
import { saveAs } from 'file-saver/src/FileSaver';
import { RequestPosition } from "../../common/models/request-position";

@Injectable()
export class OffersService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  addOffer(id: Uuid, positionId, offer: RequestOfferPosition) {
    const url = `requests/backoffice/${id}/positions/${positionId}/add-offer`;
    return this.api.post(url, offer);
  }

  editOffer(id: Uuid, positionId, editedOffer: RequestOfferPosition) {
    const url = `requests/backoffice/${id}/positions/${positionId}/edit-offer`;
    return this.api.post(url, editedOffer);
  }

  publishOffers(id: Uuid, positionId) {
    const url = `requests/backoffice/${id}/positions/${positionId}/publish-offers`;
    return this.api.post(url, {});
  }

  publishRequestOffers(id: Uuid, requestPositions: RequestPosition[]) {
    const url = `requests/backoffice/${id}/publish-offers`;
      const ids = [];
      for (const requestPosition of requestPositions) {
        ids.push(requestPosition.id);
      }
    return this.api.post(url, {
      positionIds: ids
    });
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

  addOffersFromExcel(request: Request, files: File[]): Observable<any> {
    return this.api.post(
      `requests/backoffice/${request.id}/add-offers-from-excel`,
      this.convertModelToFormData(files, null, 'files')
    );
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
}

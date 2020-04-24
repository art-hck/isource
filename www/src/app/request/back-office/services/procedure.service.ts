import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { RequestOfferPosition } from "../../common/models/request-offer-position";
import { Observable } from "rxjs";
import { Request } from "../../common/models/request";
import { ProcedureCreateResponse } from '../models/procedure-create-response';
import { Procedure } from "../models/procedure";

@Injectable()
export class ProcedureService {

  constructor(
    protected api: HttpClient,
  ) {}

  createProcedure(requestId: Uuid, body: Procedure): Observable<ProcedureCreateResponse> {
    const url = `requests/backoffice/${requestId}/create-procedure`;

    return this.api.post<ProcedureCreateResponse>(url, body);
  }

  /**
   *   Функция возможно может понадобиться для автоматической выгрузки результатов процедуры
   *   в Маркетплейс при переходе процедуры на статус «Подведение итогов»
   */
  importOffersFromProcedure(request: Request): Observable<RequestOfferPosition[]> {
    return this.api.get<RequestOfferPosition[]>(`requests/backoffice/${request.id}/procedure-offers`);
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

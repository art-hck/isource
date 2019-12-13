import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "../../common/models/request-position";
import { ProcedureInfo } from "../models/procedure-info";
import { ProcedureProperties } from "../models/procedure-properties";
import { RequestDocument } from "../../common/models/request-document";
import { ContragentList } from "../../../contragent/models/contragent-list";
import { RequestOfferPosition } from "../../common/models/request-offer-position";
import { Observable } from "rxjs";
import { Request } from "../../common/models/request";
import { PublishProcedureInfo } from '../models/publish-procedure-info';
import { map } from 'rxjs/operators';
import { PublishProcedureResult } from '../models/publish-procedure-result';
import { PublishProcedureRequest } from '../models/publish-procedure-request';

@Injectable()
export class ProcedureService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  publishProcedure(request: PublishProcedureRequest): Observable<PublishProcedureResult> {
    const publishProcedureInfo = request.procedureInfo;

    const id = publishProcedureInfo.requestId;
    const requestPositions = publishProcedureInfo.selectedProcedurePositions;
    const procedureDocuments = publishProcedureInfo.selectedProcedureDocuments;
    const procedureLotDocuments = publishProcedureInfo.selectedProcedureLotDocuments;
    const procedurePrivateAccessContragents = publishProcedureInfo.selectedPrivateAccessContragents;
    const procedureInfo = publishProcedureInfo.procedureInfo;
    const procedureProperties = publishProcedureInfo.procedureProperties;

    const url = `requests/backoffice/${id}/create-procedure`;

    const positionIds = requestPositions.map(item => item.id);
    const procedureDocumentIds = procedureDocuments.map(item => item.id);
    const procedureLotDocumentIds = procedureLotDocuments.map(item => item.id);
    const procedurePrivateAccessContragentIds = procedurePrivateAccessContragents.map(item => item.id);

    return this.api.post(url, {
      procedureTitle: procedureInfo.procedureTitle,
      dateEndRegistration: procedureInfo.dateEndRegistration,
      summingupDate: procedureInfo.summingupDate,
      dishonestSuppliersForbidden: procedureInfo.dishonestSuppliersForbidden,
      positions: positionIds,
      manualEndRegistration: procedureProperties.manualEndRegistration,
      positionsAllowAnalogsOnly: procedureProperties.positionsAllowAnalogsOnly,
      positionsAnalogs: procedureProperties.positionsAnalogs,
      positionsApplicsVisibility: procedureProperties.positionsApplicsVisibility,
      positionsBestPriceType: procedureProperties.positionsBestPriceType,
      positionsEntireVolume: procedureProperties.positionsEntireVolume,
      positionsRequiredAll: procedureProperties.positionsRequiredAll,
      positionsSuppliersVisibility: procedureProperties.positionsSuppliersVisibility,
      prolongateEndRegistration: procedureProperties.prolongateEndRegistration,
      procedureDocuments: procedureDocumentIds,
      procedureLotDocuments: procedureLotDocumentIds,
      privateAccessContragents: procedurePrivateAccessContragentIds,
      getTPFilesOnImport: request.getTPFilesOnImport
    }).pipe(map((data) => {
      return data as PublishProcedureResult;
    }));
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

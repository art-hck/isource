import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import {RequestPosition} from "../../common/models/request-position";
import {ProcedureInfo} from "../models/procedure-info";
import {ProcedureProperties} from "../models/procedure-properties";

@Injectable()
export class ProcedureService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  publishProcedure(id: Uuid, procedureInfo: ProcedureInfo, procedureProperties: ProcedureProperties, requestPositions: RequestPosition[]) {
    const url = `requests/backoffice/${id}/create-procedure`;
    const ids = [];
    for (const requestPosition of requestPositions) {
      ids.push(requestPosition.id);
    }
    return this.api.post(url, {
      procedureTitle: procedureInfo.procedureTitle,
      dateEndRegistration: procedureInfo.dateEndRegistration,
      summingupDate: procedureInfo.summingupDate,
      dishonestSuppliersForbidden: procedureInfo.dishonestSuppliersForbidden,
      positions: ids,
      manualEndRegistration: procedureProperties.manualEndRegistration,
      positionsAllowAnalogsOnly: procedureProperties.positionsAllowAnalogsOnly,
      positionsAnalogs: procedureProperties.positionsAnalogs,
      positionsApplicsVisibility: procedureProperties.positionsApplicsVisibility,
      positionsBestPriceType: procedureProperties.positionsBestPriceType,
      positionsEntireVolume: procedureProperties.positionsEntireVolume,
      positionsRequiredAll: procedureProperties.positionsRequiredAll,
      positionsSuppliersVisibility: procedureProperties.positionsSuppliersVisibility,
      prolongateEndRegistration: procedureProperties.prolongateEndRegistration
    });
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

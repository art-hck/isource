import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RequestPosition} from "../models/request-position";
import {PositionInfoContract} from "../models/positionInfoContract";
import {Uuid} from "../../../cart/models/uuid";

@Injectable({
  providedIn: 'root'
})
export class PositionInfoContractService {

  constructor(protected api: HttpClient) {
  }

  addCustomerContract(id: Uuid, requestPosition: RequestPosition, contractItem: PositionInfoContract) {
    return this.api.post(`requests/customer/${id}/positions/${requestPosition.id}/add-contract-documents`,
      this.convertModelToFormData(contractItem));
  }

  addBackofficeContract(id: Uuid, requestPosition: RequestPosition, contractItem: PositionInfoContract) {
    return this.api.post(`requests/backoffice/${id}/positions/${requestPosition.id}/add-contract-documents`,
      this.convertModelToFormData(contractItem));
  }

  getCustomerContract(id: Uuid, requestPosition: RequestPosition) {
    return this.api.post(`requests/customer/${id}/positions/${requestPosition.id}/contract`, {});
  }

  getBackofficeContract(id: Uuid, requestPosition: RequestPosition) {
    return this.api.post(`requests/backoffice/${id}/positions/${requestPosition.id}/contract`, {});
  }

  // TODO копипаст, вынести в отдельный сервис
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

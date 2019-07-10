import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RequestPosition } from "../models/request-position";
import {Contract} from "../models/contract";
import {Uuid} from "../../../cart/models/uuid";

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(protected api: HttpClient) {
  }

  addContract(id: Uuid, requestPosition: RequestPosition, contractItem: Contract) {
    return this.api.post(`requests/customer/${id}/positions/${requestPosition.id}/add-contract-documents`,
      this.convertModelToFormData(contractItem));
  }

  getCustomerContract(id: Uuid, requestPosition: RequestPosition) {
    return this.api.post(`requests/customer/${id}/positions/${requestPosition.id}/contract`, {
    });
  }

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

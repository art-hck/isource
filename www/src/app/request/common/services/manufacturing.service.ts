import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Uuid } from 'src/app/cart/models/uuid';
import { RequestPosition } from '../models/request-position';
import { ManufacturingDocument } from '../models/manufacturing-document';
import { Manufacturing } from '../models/manufacturing';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManufacturingService {

  constructor(protected api: HttpClient) {
  }

  addBackofficeDocument(
    id: Uuid,
    requestPosition: RequestPosition,
    manufacturingItem: Manufacturing
  ): Observable<ManufacturingDocument[]>|null {
    const positionId = requestPosition.id;
    if (!positionId) {
      return null;
    }
    const url = `/requests/backoffice/${id}/positions/${positionId}/manufacturing-documents/upload`;
    const data = this.convertModelToFormData(manufacturingItem);
    return this.api.post(url, data).pipe(map((resp: Object[]) => {
      const res = [];
      for (const item of resp) {
        const doc = new ManufacturingDocument();
        Object.assign(doc, item);
        res.push(doc);
      }
      return res;
    }));
  }

  // TODO: 2019-07-25 Вынести функцию convertModelToFormData в отдельный модуль

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

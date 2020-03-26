import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Observable } from 'rxjs';
import { Uuid } from 'src/app/cart/models/uuid';
import { RequestPosition } from "../models/request-position";
import { Request } from "../models/request";


@Injectable()
export class CreateRequestService {

  constructor(
    protected api: HttpClient
  ) {
  }

  addRequest(name: string, positions: Array<any>): Observable<Request> {
    const requestData = this.convertModelToFormData({ name, positions }, null, '');

    return this.api.post<Request>(`requests/customer/add-request/manual`, requestData);
  }

  addRequestPosition(requestId: Uuid, requestItem: Array<any>):  Observable<Array<RequestPosition>> {
    return this.api.post<Array<RequestPosition>>(
      `requests/${requestId}/add-positions/manual`,
      this.convertModelToFormData(requestItem, null, 'positions')
    );
  }

  addFreeFormRequest(requestItem: any) {
    return this.api.post<Request>(
      `requests/customer/add-request/free-form`,
      this.convertModelToFormData(requestItem, null, 'request'));
  }


  addRequestFromExcel(files: File[], requestName: string): Observable<any> {
    const data = {
      files: files,
      name: requestName
    };

    const requestData = this.convertModelToFormData(data, null, '');

    return this.api.post(`requests/customer/add-request/from-excel`, requestData);
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

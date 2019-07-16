import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Observable } from 'rxjs';
import { Uuid } from 'src/app/cart/models/uuid';
import { map } from 'rxjs/operators';


@Injectable()
export class CreateRequestService {

  constructor(
    protected api: HttpClient
  ) {
  }

  addRequest(requestItem: Array<any>) {
    return this.api.post(
      `requests/customer/add-request/manual`,
      this.convertModelToFormData(requestItem, null, 'positions'));
  }

  addRequestPosition(requestId: Uuid, requestItem: Array<any>): Observable<Array<{id: Uuid}>> {
    return this.api.post(
      `requests/${requestId}/add-positions/manual`,
      this.convertModelToFormData(requestItem, null, 'positions')
    ).pipe(map((ids: Array<any>) => {
      const res = [];
      for (const item of ids) {
        res.push({id: item['id']});
      }
      return res;
    }));
  }

  addFreeFormRequest(requestItem: any) {
    return this.api.post(
      `requests/customer/add-request/free-form`,
      this.convertModelToFormData(requestItem, null, 'request'));
  }


  addRequestFromExcel(files: File[]): Observable<any> {
    return this.api.post(
      `requests/customer/add-request/from-excel`,
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

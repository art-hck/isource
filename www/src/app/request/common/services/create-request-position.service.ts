import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Observable } from 'rxjs';
import {Request} from "../models/request";

@Injectable({
  providedIn: 'root'
})
export class CreateRequestPositionService {

  constructor(
    protected api: HttpClient
  ) {
  }

  addCustomerRequestPositionsFromExcel(request: Request, files: File[]): Observable<any> {
    return this.api.post(
      `requests/customer/${request.id}/add-positions/from-excel`,
      this.convertModelToFormData(files, null, 'files')
    );
  }

  addBackofficeRequestPositionsFromExcel(request: Request, files: File[]): Observable<any> {
    return this.api.post(
        `requests/backoffice/${request.id}/add-positions/from-excel`,
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

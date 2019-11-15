import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";

@Injectable()
export class TechnicalProposalsService {

  addTechnicalProposalLoader = false;

  constructor(
    protected api: HttpClient,
  ) {
  }

  getTechnicalProposalsList(requestId: Uuid) {
    const url = `requests/backoffice/${requestId}/technical-proposals`;
    return this.api.get(url);
  }

  getTechnicalProposalsPositionsList(id: Uuid) {
    const url = `requests/backoffice/${id}/technical-proposals/positions`;
    return this.api.get(url);
  }

  addTechnicalProposal(requestId: Uuid, technicalProposal) {
    const url = `requests/backoffice/${requestId}/technical-proposals/create`;
    return this.api.post(url, technicalProposal);
  }

  updateTechnicalProposal(requestId: Uuid, technicalProposal) {
    const url = `requests/backoffice/${requestId}/technical-proposals/edit`;
    return this.api.post(url, technicalProposal);
  }

  uploadSelectedDocuments(requestId: Uuid, tpId: Uuid, formData) {
    const url = `requests/backoffice/${requestId}/technical-proposals/${tpId}/upload-documents`;
    return this.api.post(url, formData);
  }

  updateTpPositionManufacturingName(requestId: Uuid, tpId: Uuid, technicalProposal) {
    const url = `requests/backoffice/${requestId}/technical-proposals/${tpId}/update-manufacturing-name`;
    return this.api.post(url, technicalProposal);
  }

  sendToAgreement(requestId: Uuid, tpId: Uuid, technicalProposal) {
    const url = `requests/backoffice/${requestId}/technical-proposals/${tpId}/send-to-agreement`;
    return this.api.post(url, technicalProposal);
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

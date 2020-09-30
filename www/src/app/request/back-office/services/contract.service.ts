import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "../../common/models/request-position";
import { Contract } from "../../common/models/contract";
import { ContractCreate } from "../../common/models/requests-list/contract-create";
import { RequestDocument } from "../../common/models/request-document";
import { ContragentWithPositions } from "../../common/models/contragentWithPositions";
import { FormDataService } from "../../../shared/services/form-data.service";

@Injectable()
export class ContractService {
  constructor(private api: HttpClient, private formDataService: FormDataService) {}

  list(requestId): Observable<Contract[]> {
    const url = `requests/${requestId}/contracts`;

    return this.api.get<Contract[]>(url);
  }

  create(requestId: Uuid, contragentId: Uuid, positions: RequestPosition[]): Observable<Contract> {
    const url = `requests/${requestId}/contracts/create`;
    const body: ContractCreate = {
      supplierId: contragentId,
      positions: positions.map(position => position.id)
    };

    return this.api.post<Contract>(url, body);
  }

  suppliers(requestId): Observable<ContragentWithPositions[]> {
    const url = `requests/${requestId}/contracts/suppliers`;

    return this.api.get<ContragentWithPositions[]>(url);
  }

  sendForApproval(requestId: Uuid, contractId: Uuid) {
    const url = `requests/${requestId}/contracts/${contractId}/send-for-approval`;

    return this.api.post<Contract>(url, null);
  }

  sign(contractId: Uuid) {
    const url = `requests/backoffice/contracts/${contractId}/sign`;

    return this.api.post<Contract>(url, null);
  }

  upload(requestId: Uuid, contractId: Uuid, file: File, comment?: string): Observable<RequestDocument[]> {
    const url = `requests/${requestId}/contracts/${contractId}/upload`;
    return this.api.post<RequestDocument[]>(url, this.formDataService.toFormData({ files: [file], comments: [comment] }));
  }

  download(requestId: Uuid, contractId: Uuid) {
    const url = `requests/${requestId}/contracts/${contractId}/generate`;
    return this.api.post(url, {}, { responseType: 'blob' });
  }
}

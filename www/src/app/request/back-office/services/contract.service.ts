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

  create(requestId: Uuid, supplierId: Uuid, positions: RequestPosition[]): Observable<Contract> {
    const url = `requests/backoffice/contracts/create`;
    const body: ContractCreate = { supplierId, requestId, positions: positions.map(position => position.id) };

    return this.api.post<Contract>(url, body);
  }

  suppliers(requestId): Observable<ContragentWithPositions[]> {
    const url = `requests/backoffice/contracts/suppliers`;

    return this.api.post<ContragentWithPositions[]>(url, { requestId });
  }

  sendForApproval(contractId: Uuid) {
    const url = `requests/backoffice/contracts/${contractId}/send-for-approval`;

    return this.api.get<Contract>(url);
  }

  sign(contractId: Uuid) {
    const url = `requests/backoffice/contracts/${contractId}/sign`;

    return this.api.get<Contract>(url);
  }

  rollback(contractId: Uuid) {
    const url = `requests/backoffice/contracts/${contractId}/cancel-send-for-approval`;

    return this.api.get<Contract>(url);
  }

  upload(contractId: Uuid, files: File[], comment?: string): Observable<RequestDocument[]> {
    const url = `requests/contracts/${contractId}/upload`;
    return this.api.post<RequestDocument[]>(url, this.formDataService.toFormData({ files, comments: [comment] }));
  }

  download(contractId: Uuid) {
    const url = `requests/contracts/${contractId}/generate`;
    return this.api.post(url, {}, { responseType: 'blob' });
  }
}

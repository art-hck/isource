import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ContragentWithPositions } from "../models/contragentWithPositions";
import { Contract } from "../models/contract";
import { ContragentList } from "../../../contragent/models/contragent-list";
import { RequestPosition } from "../models/request-position";
import { RequestDocument } from "../models/request-document";
import { Request } from "../models/request";
import { ContractCreate } from "../models/requests-list/contract-create";
import { Uuid } from "../../../cart/models/uuid";
import { saveAs } from 'file-saver/src/FileSaver';

@Injectable()
export class ContractService {

  constructor(protected api: HttpClient) {
  }

  create(request: Request, contragentId: Uuid, positions: RequestPosition[]): Observable<Contract> {
    const url = `requests/${request.id}/contracts/create`;
    const body: ContractCreate = {
      supplierId: contragentId,
      positions: positions.map(position => position.id)
    };

    return this.api.post<Contract>(url, body);
  }

  uploadDocument(request: Request, contract: Contract, file: File, comment: string): Observable<RequestDocument[]> {
    const url = `requests/${request.id}/contracts/${contract.id}/upload`;

    const formData = new FormData();
    formData.append('files[]', file, file.name);
    formData.append('comments[]', comment);

    return this.api.post<RequestDocument[]>(url, formData);
  }

  getContragentsWithPositions(requestId): Observable<ContragentWithPositions[]> {
    const url = `requests/${requestId}/contracts/suppliers`;

    return this.api.get<ContragentWithPositions[]>(url);
  }

  getContracts(requestId): Observable<Contract[]> {
    const url = `requests/${requestId}/contracts`;

    return this.api.get<Contract[]>(url);
  }

  onApproval(requestId: Uuid, contractId: Uuid) {
    const url = `requests/${requestId}/contracts/${contractId}/send-for-approval`;

    return this.api.post<Contract>(url, null);
  }

  reject(requestId: Uuid, contractId: Uuid) {
    const url = `requests/${requestId}/contracts/${contractId}/reject`;

    return this.api.post<Contract>(url, null);
  }

  approve(requestId: Uuid, contractId: Uuid) {
    const url = `requests/${requestId}/contracts/${contractId}/approve`;

    return this.api.post<Contract>(url, null);
  }

  sign(contractId: Uuid) {
    const url = `requests/backoffice/contracts/${contractId}/sign`;

    return this.api.post<Contract>(url, null);
  }

  generateContract(requestId: Uuid, contractId: Uuid) {
    const fileName = 'Договор.docx';
    this.api.post(
      `requests/${requestId}/contracts/${contractId}/generate`,
      {},
      {responseType: 'blob'})
      .subscribe(data => {
        saveAs(data, fileName);
      });
  }
}

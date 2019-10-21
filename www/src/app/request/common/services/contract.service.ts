import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ContragentWithPositions } from "../models/contragentWithPositions";
import { delay, flatMap, map } from "rxjs/operators";
import { Contract, ContractStatus } from "../models/contract";
import { ContragentList } from "../../../contragent/models/contragent-list";
import { RequestPosition } from "../models/request-position";
import { RequestDocument } from "../models/request-document";
import { Request } from "../models/request";
import { ContractCreate } from "../models/requests-list/contract-create";
import { ContragentService } from "../../../contragent/services/contragent.service";
import { DesignDocumentationService } from "../../back-office/services/design-documentation.service";
import { Uuid } from "../../../cart/models/uuid";

@Injectable()
export class ContractService {

  constructor(protected api: HttpClient, private contragentService: ContragentService, private designDocumentationService: DesignDocumentationService) {
  }

  create(request: Request, contragent: ContragentList, positions: RequestPosition[]): Observable<Contract> {
    const url = `requests/${request.id}/contracts/create`;
    const body: ContractCreate = {
      supplierId: contragent.id,
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
    const url = `requests/${requestId}/contracts/${contractId}/on-approval`;

    return this.api.post<Contract>(url, null);
  }

  reject(requestId: Uuid, contractId: Uuid) {
    const url = `requests/${requestId}/contracts/${contractId}/reject`;

    return this.api.post<Contract>(url, null);
  }

  approval(requestId: Uuid, contractId: Uuid) {
    const url = `requests/${requestId}/contracts/${contractId}/approval`;

    return this.api.post<Contract>(url, null);
  }
}

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

    return this.api.post<Contract>(url, body)
      // TODO: remove after implement statuses
      .pipe(map(contract => {contract.status = ContractStatus.NEW; return contract; }));
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

    return this.api.get<Contract[]>(url)
      .pipe(map(contracts => contracts.map(contract => {
        contract.status = ContractStatus.NEW;
        return contract;
      }))) // TODO: remove
      ;
  }

  // @TODO: REST not implemented
  onApproval(contract: Contract) {
    return of(contract).pipe(this.simulateDelay(), map(c => { c.status = ContractStatus.ON_APPROVAL; return contract; }));
  }

  // @TODO: REST not implemented
  reject(contract: Contract) {
    return of(contract).pipe(this.simulateDelay(), map(c => { c.status = ContractStatus.REJECTED; return contract; }));
  }

  // @TODO: REST not implemented
  approval(contract: Contract) {
    return of(contract).pipe(this.simulateDelay(), map(c => { c.status = ContractStatus.APPROVAL; return contract; }));
  }

  // @TODO remove after implement all REST
  private simulateDelay<T>(min = 100, max = 400) {
    return delay<T>(Math.floor(Math.random() * (max - min + 1) + min));
  }
}

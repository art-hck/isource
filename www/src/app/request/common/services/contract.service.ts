import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, pipe } from "rxjs";
import { ContragentWithPositions } from "../models/contragentWithPositions";
import { DesignDocumentationService } from "../../back-office/services/design-documentation.service";
import { ContragentService } from "../../../contragent/services/contragent.service";
import { delay, flatMap, map, publishReplay, refCount, tap } from "rxjs/operators";
import { Contract } from "../models/contract";
import { ContragentList } from "../../../contragent/models/contragent-list";
import { RequestPosition } from "../models/request-position";
import { RequestDocument } from "../models/request-document";

@Injectable()
export class ContractService {

  constructor(
    protected api: HttpClient,
    private designDocumentationService: DesignDocumentationService,
    private contragentService: ContragentService
  ) {
  }

  // @TODO implement REST
  create(contragent: ContragentList, positions: RequestPosition[]): Observable<Contract> {
    return of(this.generateContract(contragent, positions)).pipe(this.simulateDelay());
  }

  // @TODO implement REST
  uploadDocument(file: File, comment: string): Observable<RequestDocument> {
    return of({
      id: file.lastModified.toString(),
      created: file.lastModified.toString(),
      filename: file.name,
      extension: null,
      mime: null,
      size: file.size,
      comments: comment
    }).pipe(this.simulateDelay());
  }

  // @TODO implement REST
  getContragentsWithPositions(requestId): Observable<ContragentWithPositions[]> {
    return this.designDocumentationService.getPositionList(requestId).pipe(
      flatMap(
        positions => this.contragentService.getContragentList().pipe(
          map(contragents => contragents.map(contragent => ({contragent, positions})))
        )
      )
    );
  }

  // @TODO implement REST
  getContracts(requestId): Observable<Contract[]> {
    return this.designDocumentationService.getDesignDocumentationList(requestId)
      .pipe(map(ddl => ddl.map(dd => this.generateContract(
        new ContragentList({shortName: "ООО Ромашка"}), [dd.position]
        ))
      ));
  }

  // @TODO remove after implement all REST
  private simulateDelay<T>(min = 1000, max = 2000) {
    return delay<T>(Math.floor(Math.random() * (max - min + 1) + min));
  }

  // @TODO remove after implement all REST
  private generateContract(contragent: ContragentList, positions: RequestPosition[]): Contract {
    return {
      id: null,
      documents: [],
      customer: null,
      supplier: contragent,
      createdDate: null,
      request: null,
      winners: positions.map(position => ({
        id: null,
        offerPosition: {
          id: null,
          requestPosition: position,
          priceWithVat: 110,
          priceWithoutVat: 100,
          vatPercent: 100,
          currency: "RUB",
          quantity: 1,
          measureUnit: ""
        }
      }))
    };
  }
}

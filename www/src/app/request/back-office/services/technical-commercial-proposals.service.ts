import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";

@Injectable()
export class TechnicalCommercialProposalsService {

  constructor(protected api: HttpClient) {}

  create() {
    return of({}).pipe(this.delayPipe(300, 1200)) as Observable<TechnicalCommercialProposal[]>;
  }

  getList() {
    return of([]).pipe(this.delayPipe(300, 1200)) as Observable<TechnicalCommercialProposal[]>;
  }

  private delayPipe(min, max) {
    return delay(Math.floor(min + Math.random() * (max + 1 - min)));
  }
}

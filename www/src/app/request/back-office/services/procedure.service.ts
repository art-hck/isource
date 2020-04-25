import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { RequestOfferPosition } from "../../common/models/request-offer-position";
import { Observable } from "rxjs";
import { Request } from "../../common/models/request";
import { ProcedureCreateResponse } from '../models/procedure-create-response';
import { Procedure } from "../models/procedure";

@Injectable()
export class ProcedureService {

  constructor(
    protected api: HttpClient,
  ) {}

  createProcedure(requestId: Uuid, body: Procedure): Observable<ProcedureCreateResponse> {
    const url = `requests/backoffice/${requestId}/create-procedure`;

    return this.api.post<ProcedureCreateResponse>(url, body);
  }

  /**
   *   Функция возможно может понадобиться для автоматической выгрузки результатов процедуры
   *   в Маркетплейс при переходе процедуры на статус «Подведение итогов»
   */
  importOffersFromProcedure(request: Request): Observable<RequestOfferPosition[]> {
    return this.api.get<RequestOfferPosition[]>(`requests/backoffice/${request.id}/procedure-offers`);
  }

  getByPosition(positionId: Uuid) {
    const url = `/requests/backoffice/procedures-by-position`;
    return this.api.post<Procedure>(url, {positionId});
  }


}

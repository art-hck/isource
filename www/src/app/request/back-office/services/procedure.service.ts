import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { RequestOfferPosition } from "../../common/models/request-offer-position";
import { Observable } from "rxjs";
import { Request } from "../../common/models/request";
import { ProcedureCreateResponse } from '../models/procedure-create-response';
import { Procedure } from "../models/procedure";
import { FormDataService } from "../../../shared/services/form-data.service";
import { ProcedureSource } from "../../common/enum/procedure-source";

@Injectable()
export class ProcedureService {

  constructor(
    private api: HttpClient,
    private formDataService: FormDataService
  ) {}

  list(requestId: Uuid, source: ProcedureSource): Observable<Procedure[]> {
    const url = `requests/backoffice/${requestId}/procedures`;
    return this.api.post<Procedure[]>(url, { source });
  }

  create(requestId: Uuid, body: Procedure): Observable<ProcedureCreateResponse> {
    const url = `requests/backoffice/${requestId}/create-procedure`;

    return this.api.post<ProcedureCreateResponse>(url, this.formDataService.toFormData(body));
  }

  bargain(requestId: Uuid, body: Procedure): Observable<ProcedureCreateResponse> {
    const url = `requests/backoffice/${requestId}/create-retrade`;

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
    return this.api.post<Procedure[]>(url, { positionId });
  }
}

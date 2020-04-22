import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { RequestOfferPosition } from "../../common/models/request-offer-position";
import { Observable } from "rxjs";
import { Request } from "../../common/models/request";
import { ProcedureCreateResponse } from '../models/procedure-create-response';
import { ProcedureCreateRequest } from "../models/procedure-create-request";
import { FormDataService } from "../../../shared/services/form-data.service";

@Injectable()
export class ProcedureService {

  constructor(
    protected api: HttpClient,
    protected formDataService: FormDataService
  ) {}

  createProcedure(requestId: Uuid, body: ProcedureCreateRequest): Observable<ProcedureCreateResponse> {
    const url = `requests/backoffice/${requestId}/create-procedure`;

    return this.api.post<ProcedureCreateResponse>(url, this.formDataService.toFormData(body));
  }

  /**
   *   Функция возможно может понадобиться для автоматической выгрузки результатов процедуры
   *   в Маркетплейс при переходе процедуры на статус «Подведение итогов»
   */
  importOffersFromProcedure(request: Request): Observable<RequestOfferPosition[]> {
    return this.api.get<RequestOfferPosition[]>(`requests/backoffice/${request.id}/procedure-offers`);
  }
}

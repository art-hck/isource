import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { RequestOfferPosition } from "../../common/models/request-offer-position";
import { Observable } from "rxjs";
import { Request } from "../../common/models/request";
import { ProcedureCreateResponse } from '../models/procedure-create-response';
import { Procedure } from "../models/procedure";
import { FormDataService } from "../../../shared/services/form-data.service";
import { ProposalSource } from "../enum/proposal-source";
import { Okpd2 } from "../../../shared/models/okpd2";

@Injectable()
export class ProcedureService {

  constructor(
    private api: HttpClient,
    private formDataService: FormDataService
  ) {}

  list(requestId: Uuid, source: ProposalSource, groupId?: Uuid): Observable<Procedure[]> {
    const url = `requests/backoffice/${requestId}/procedures`;
    const body = { source };
    body[source === ProposalSource.COMMERCIAL_PROPOSAL ? 'requestCommercialProposalGroupId' : 'requestTechnicalCommercialProposalGroupId'] = groupId;

    return this.api.post<Procedure[]>(url, body);
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

  prolongateProcedureEndDate(requestId, procedureId, dateEndRegistration, dateSummingUp) {
    const url = `requests/backoffice/${ requestId }/procedures/${ procedureId }/prolong`;

    return this.api.post(url, { dateEndRegistration, dateSummingUp });
  }
}

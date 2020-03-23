import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "../../common/models/request-position";
import { FormDataService } from "../../../shared/services/form-data.service";

@Injectable()
export class TechnicalCommercialProposalService {

  constructor(protected api: HttpClient, private formDataService: FormDataService) {}

  list(requestId: Uuid) {
    const url = `requests/backoffice/${requestId}/technical-commercial-proposals`;
    return this.api.get<TechnicalCommercialProposal[]>(url);
  }

  create(requestId: Uuid, body: Partial<TechnicalCommercialProposal>) {
    const url = `requests/backoffice/${requestId}/technical-commercial-proposals/create`;
    return this.api.post<TechnicalCommercialProposal>(url, this.formDataService.toFormData(body));
  }

  update(requestId: Uuid, body: Partial<TechnicalCommercialProposal> & {id: Uuid}) {
    return of(body).pipe(this.delayPipe(300, 1200)) as Observable<TechnicalCommercialProposal>;
  }

  publish(requestId: Uuid, proposal: TechnicalCommercialProposal) {
    const url = `requests/backoffice/technical-commercial-proposals/${proposal.id}/send-to-review`;
    return this.api.get<TechnicalCommercialProposal>(url);
  }

  availablePositions(requestId: Uuid) {
    const url = `requests/backoffice/${requestId}/technical-commercial-proposals/available-request-positions`;
    return this.api.get<RequestPosition[]>(url);
  }

  private delayPipe(min, max) {
    return delay(Math.floor(min + Math.random() * (max + 1 - min)));
  }
}

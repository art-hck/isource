import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import {RequestOfferPosition} from "../../common/models/request-offer-position";
import { Observable } from "rxjs";
import { RequestPositionList } from "../../common/models/request-position-list";
import { map } from "rxjs/operators";
import { RequestGroup } from "../../common/models/request-group";
import { RequestPosition } from "../../common/models/request-position";

@Injectable()
export class TechnicalProposalsService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  getTechnicalProposalsList(requestId: Uuid) {
    const url = `requests/backoffice/${requestId}/technical-proposals`;
    return this.api.get(url);
  }

  getTechnicalProposalsPositionsList(id: Uuid) {
    const url = `requests/backoffice/${id}/technical-proposals/positions`;
    return this.api.get(url);
  }


  addTechnicalProposal(requestId: Uuid, technicalProposal) {
    const url = `requests/backoffice/${requestId}/technical-proposals/create`;
    return this.api.post(url, technicalProposal);
  }

  updateTechnicalProposal(requestId: Uuid, technicalProposal) {
    const url = `requests/backoffice/${requestId}/technical-proposals/edit`;
    return this.api.post(url, technicalProposal);
  }



  updateTpPositionManufacturingName(id: Uuid, tpId: Uuid, technicalProposal) {
    const url = `requests/backoffice/${id}/technical-proposals/${tpId}/update-manufacturing-name`;
    return this.api.post(url, technicalProposal);
  }

  sendToAgreement(id: Uuid, tpId: Uuid, technicalProposal) {
    const url = `requests/backoffice/${id}/technical-proposals/${tpId}/send-to-agreement`;
    return this.api.post(url, technicalProposal);
  }



  // todo Убрать потом
  getRequestPositions(id: Uuid): Observable<RequestPositionList[]> {
    const url = `requests/backoffice/${id}/positions`;
    return this.api.post<RequestPositionList[]>(url, {}).pipe(
      map((data: RequestPositionList[]) => {
        return data.map((item: RequestPositionList) => {
          switch (item.entityType) {
            case 'GROUP':
              return new RequestGroup(item);
            case 'POSITION':
              return new RequestPosition(item);
          }
        });
      })
    );
  }


}

import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import {RequestOfferPosition} from "../../common/models/request-offer-position";

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


  addTechnicalProposal(id: Uuid, positionId, offer: RequestOfferPosition) {
    const url = `requests/backoffice/:requestId/technical-proposals/create`;
    return this.api.post(url, offer);
  }

  updateTechnicalProposal(id: Uuid, positionId, offer: RequestOfferPosition) {
    const url = `requests/backoffice/:requestId/technical-proposals/edit`;
    return this.api.post(url, offer);
  }



  updateTpPositionManufacturingName(id: Uuid, tpId: Uuid, technicalProposal) {
    const url = `requests/backoffice/${id}/technical-proposals/${tpId}/update-manufacturing-name`;
    return this.api.post(url, technicalProposal);
  }

  sendToAgreement(id: Uuid, tpId: Uuid, technicalProposal) {
    const url = `requests/backoffice/${id}/technical-proposals/${tpId}/send-to-agreement`;
    return this.api.post(url, technicalProposal);
  }



}

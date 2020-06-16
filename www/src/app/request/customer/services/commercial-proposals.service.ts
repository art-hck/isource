import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { PositionsWithSuppliers } from "../../back-office/models/positions-with-suppliers";
import { Guid } from "guid-typescript";

@Injectable({
  providedIn: "root"
})
export class CommercialProposalsService {

  constructor(private api: HttpClient) {}

  positionsWithOffers(requestId: Uuid) {
    const url = `requests/customer/${requestId}/positions-with-offers`;
    return this.api.get<PositionsWithSuppliers>(url);
  }

  accept(requestId: Uuid, positionIdsWithProposalIds: { [key in Uuid]: Uuid }) {
    const url = `requests/customer/${requestId}/commercial-proposals/accept`;
    return this.api.post(url, positionIdsWithProposalIds);
  }
}

import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Position } from "./position";
import { Proposal } from "./proposal";
import { TechnicalCommercialProposalPosition } from "../../../request/common/models/technical-commercial-proposal-position";


@Injectable({
  providedIn: "root"
})
export class ProposalHelperService {

  isValid(position: Position, proposal: Proposal): boolean {
    return this.isDateValid(position, proposal) && this.isQuantityMoreOrLess(position, proposal) === 0;
  }

  isDateValid(position: Position, { deliveryDate }: Proposal): boolean {
    return position.isDeliveryDateAsap ||
      moment(deliveryDate).isSameOrBefore(moment(position.deliveryDate));
  }

  isQuantityMoreOrLess(position: Position, { quantity }: Proposal): number {
    if (quantity === position.quantity) {
      return 0;
    } else if (quantity > position.quantity) {
      return 1;
    } else {
      return -1;
    }
  }

  chooseBy(type: "date" | "price", position: Position, proposals: Proposal[]): Proposal["sourceProposal"] {
    return proposals.reduce((prev, curr) => {
      const prevValid = prev && this.isValid(position, prev);
      const currValid = curr && this.isValid(position, curr);
      if (prevValid && !currValid) { return prev; }
      if (!prevValid && currValid) { return curr; }
      if (!prevValid && !currValid) { return null; }

      switch (type) {
        case "price":
          return prev.priceWithoutVat <= curr.priceWithoutVat ? prev : curr;
        case "date":
          if (moment(prev.deliveryDate).isSame(curr.deliveryDate)) {
            return prev.priceWithoutVat <= curr.priceWithoutVat ? prev : curr;
          } else {
            return moment(prev.deliveryDate).isBefore(curr.deliveryDate) ? prev : curr;
          }
      }
    }).sourceProposal;
  }
}

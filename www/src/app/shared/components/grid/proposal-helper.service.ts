import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Position } from "./position";
import { Proposal } from "./proposal";


@Injectable({
  providedIn: "root"
})
export class ProposalHelperService {

  isValid(position: Position, proposal: Proposal): boolean {
    return this.isDateValid(position, proposal) && this.isQuantityValid(position, proposal);
  }

  isDateValid(position: Position, { deliveryDate }: Proposal): boolean {
    return position.isDeliveryDateAsap ||
      moment(deliveryDate).isSameOrBefore(moment(position.deliveryDate));
  }

  isQuantityValid(position: Position, { quantity }: Proposal): boolean {
    return position.quantity === quantity;
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

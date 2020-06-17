import { Injectable } from "@angular/core";
import { TechnicalCommercialProposalPosition } from "../models/technical-commercial-proposal-position";
import * as moment from "moment";
import { TechnicalCommercialProposalByPosition } from "../models/technical-commercial-proposal-by-position";
type ProposalByPositionData = TechnicalCommercialProposalByPosition["data"];

@Injectable({
  providedIn: "root"
})
export class TechnicalCommercialProposalHelperService {

  isValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return this.isDateValid(proposalPosition) && this.isQuantityMoreOrLess(proposalPosition) === 0;
  }

  isDateValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return proposalPosition.position.isDeliveryDateAsap ||
      moment(proposalPosition.deliveryDate).isSameOrBefore(moment(proposalPosition.position.deliveryDate));
  }

  isQuantityValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return proposalPosition.quantity === proposalPosition.position.quantity;
  }

  isQuantityMoreOrLess(proposalPosition: TechnicalCommercialProposalPosition): number {
    if (proposalPosition.quantity === proposalPosition.position.quantity) {
      return 0;
    } else if (proposalPosition.quantity > proposalPosition.position.quantity) {
      return 1;
    } else {
      return -1;
    }
  }

  chooseBy(type: "date" | "price", data: ProposalByPositionData): TechnicalCommercialProposalPosition {
    return data.reduce((prev, curr) => {
      const prevValid = prev && this.isValid(prev.proposalPosition);
      const currValid = curr && this.isValid(curr.proposalPosition);
      if (prevValid && !currValid) { return prev; }
      if (!prevValid && currValid) { return curr; }
      if (!prevValid && !currValid) { return null; }

      switch (type) {
        case "price":
          return prev.proposalPosition.priceWithoutVat <= curr.proposalPosition.priceWithoutVat ? prev : curr;
        case "date":
          if (moment(prev.proposalPosition.deliveryDate).isSame(curr.proposalPosition.deliveryDate)) {
            return prev.proposalPosition.priceWithoutVat <= curr.proposalPosition.priceWithoutVat ? prev : curr;
          } else {
            return moment(prev.proposalPosition.deliveryDate).isBefore(curr.proposalPosition.deliveryDate) ? prev : curr;
          }
      }
    }).proposalPosition;
  }
}

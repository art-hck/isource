import { Injectable } from "@angular/core";
import { TechnicalCommercialProposalPosition } from "../models/technical-commercial-proposal-position";
import * as moment from "moment";
import { TechnicalCommercialProposalByPosition } from "../models/technical-commercial-proposal-by-position";
import { TechnicalCommercialProposal } from "../models/technical-commercial-proposal";

@Injectable({
  providedIn: "root"
})
export class TechnicalCommercialProposalHelperService {

  isValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return this.isDateValid(proposalPosition) && this.isQuantityValid(proposalPosition);
  }

  isDateValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return proposalPosition.position.isDeliveryDateAsap ||
      moment(proposalPosition.deliveryDate).isSameOrBefore(moment(proposalPosition.position.deliveryDate));
  }

  isQuantityValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return proposalPosition.quantity === proposalPosition.position.quantity;
  }

  getRequestedQuantityLabel(proposalPosition: TechnicalCommercialProposalPosition): string {
    return proposalPosition.quantity > proposalPosition.position.quantity ?
      ' - Количество больше нужного' :
      ' - Количество меньше нужного';
  }

  getSummaryPrice(positions: TechnicalCommercialProposalPosition[]): number {
    return positions.map(position => position.priceWithoutVat * position.quantity).reduce((sum, priceWithoutVat) => sum + priceWithoutVat, 0);
  }

  chooseBy(type: "date" | "price", position: TechnicalCommercialProposalPosition, proposals: TechnicalCommercialProposal[]): TechnicalCommercialProposal {
    return proposals.reduce((prev, curr) => {
      const prevPos = prev?.positions?.find(pos => pos.position.id === position.position.id);
      const currPos = curr?.positions?.find(pos => pos.position.id === position.position.id);

      if (type === 'date') {
        const prevValid = prevPos && this.isValid(prevPos);
        const currValid = currPos && this.isValid(currPos);
        if (prevValid && !currValid) { return prev; }
        if (!prevValid && currValid) { return curr; }
      }

      switch (type) {
        case "price":
          return prevPos.priceWithoutVat <= currPos.priceWithoutVat ? prev : curr;
        case "date":
          if (moment(prevPos.deliveryDate).isSame(currPos.deliveryDate)) {
            return prevPos.priceWithoutVat <= currPos.priceWithoutVat ? prev : curr;
          } else {
            return moment(prevPos.deliveryDate).isBefore(currPos.deliveryDate) ? prev : curr;
          }
      }
    });
  }
}

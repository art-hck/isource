import { Injectable } from "@angular/core";
import { TechnicalCommercialProposalPosition } from "../models/technical-commercial-proposal-position";
import * as moment from "moment";
import { TechnicalCommercialProposalByPosition } from "../models/technical-commercial-proposal-by-position";
import { TechnicalCommercialProposal } from "../models/technical-commercial-proposal";
import { CommonProposal, CommonProposalItem } from "../models/common-proposal";
import { RequestPosition } from "../models/request-position";

@Injectable({
  providedIn: "root"
})
export class TechnicalCommercialProposalHelperService {

  isValid(proposalPosition: CommonProposalItem, position: RequestPosition): boolean {
    return this.isDateValid(proposalPosition, position) && this.isQuantityValid(proposalPosition, position);
  }

  isDateValid(proposalPosition: CommonProposalItem, position: RequestPosition): boolean {
    return position?.isDeliveryDateAsap ||
      moment(proposalPosition?.deliveryDate).isSameOrBefore(moment(position?.deliveryDate));
  }

  isQuantityValid(proposalPosition: CommonProposalItem, position: RequestPosition): boolean {
    return proposalPosition?.quantity === position?.quantity;
  }

  getRequestedQuantityLabel(proposalPosition: CommonProposalItem, position: RequestPosition): string {
    return proposalPosition?.quantity > position?.quantity ?
      ' - Количество больше нужного' :
      ' - Количество меньше нужного';
  }

  getSummaryPrice(positions: CommonProposalItem[]): number {
    return positions.map(position => position.priceWithoutVat * position.quantity).reduce((sum, priceWithoutVat) => sum + priceWithoutVat, 0);
  }

  chooseBy(type: "date" | "price", position: RequestPosition, proposals: CommonProposal[]): CommonProposal {
    return proposals?.reduce((prev, curr) => {
      const prevPos = prev?.items?.find(pos => pos.id === position.id);
      const currPos = curr?.items?.find(pos => pos.id === position.id);

      if (type === 'date') {
        const prevValid = prevPos && this.isValid(prevPos, position);
        const currValid = currPos && this.isValid(currPos, position);
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
    }, null);
  }
}

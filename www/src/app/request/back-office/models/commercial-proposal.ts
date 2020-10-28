import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";
import { RequestOfferPosition } from "../../common/models/request-offer-position";
import { RequestPosition } from "../../common/models/request-position";

export class CommercialProposal {
  supplier: ContragentShortInfo;
  items: {
    linkedOffer: RequestOfferPosition,
    position: RequestPosition
  }[];
}

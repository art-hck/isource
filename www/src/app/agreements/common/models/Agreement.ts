import { Uuid } from "../../../cart/models/uuid";
import { Request } from "../../../request/common/models/request";
import { PositionStatus } from "../../../request/common/enum/position-status";
import { AgreementAction } from "../../back-office/enum/agreement-action";
import { TechnicalProposal } from "../../../request/common/models/technical-proposal";

export class Agreement {
  id: Uuid;
  type: string;
  action: {
    name: AgreementAction;
    label: string;
  };
  issuedDate: string;
  request: Request;
  groupCounter: number;
  requestTechnicalProposal?: TechnicalProposal;
  positionsStatus: {
    name: PositionStatus;
    label: string;
  };
}

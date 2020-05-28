import { Uuid } from "../../../cart/models/uuid";
import { Request } from "../../../request/common/models/request";
import { PositionStatus } from "../../../request/common/enum/position-status";
import { AgreementAction } from "../../back-office/enum/agreement-action";

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
  positionsStatus: {
    name: PositionStatus;
    label: string;
  };
}

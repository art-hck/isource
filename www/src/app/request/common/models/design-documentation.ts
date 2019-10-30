import {Uuid} from "../../../cart/models/uuid";
import {RequestDocument} from "./request-document";
import { DesignDocumentationType } from "../enum/design-documentation-type";

export class DesignDocumentation {
  id: Uuid;
  name: string;
  status: string;
  adjustmentDate?: Date;
  adjustmentLimit: number;
  receivingDate?: Date;
  receivingLimit: number;
  reviewDate?: Date;
  comment: string;
  type: DesignDocumentationType;
  documents: RequestDocument[];
}

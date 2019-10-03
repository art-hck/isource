import {Uuid} from "../../../cart/models/uuid";
import {RequestDocument} from "./request-document";

export class DesignDocumentation {
  id: Uuid;
  name: string;
  status: string;
  adjustmentDate: Date;
  receivingDate: Date;
  reviewDate: Date;
  comment: string;
  documents: RequestDocument[];
}

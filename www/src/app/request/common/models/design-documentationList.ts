import {Uuid} from "../../../cart/models/uuid";
import {DesignDocumentation} from "./design-documentation";
import {RequestPosition} from "./request-position";

export class DesignDocumentationList {
  id: Uuid;
  position: RequestPosition;
  designDocs: DesignDocumentation[];
}

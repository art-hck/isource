import {Uuid} from "../../../cart/models/uuid";

export interface AttachedFile {
  id: Uuid;
  filename: string;
  docType: string;
  uploadDate: Date;
}

import { HttpClient } from "@angular/common/http";
import { Uuid } from "../../cart/models/uuid";
import { saveAs } from 'file-saver/src/FileSaver';
import { Injectable } from "@angular/core";
import { AttachedFile } from "../models/attached-file";

@Injectable({
  providedIn: 'root'
})

export class CustomerDocumentService {

  attachedFiles?: AttachedFile[] = [];

  protected purchaseId: Uuid;

  constructor(
    private api: HttpClient
  ) {
  }

  /**
   *
   * @param purchaseId
   */
  init(purchaseId: Uuid): void {
    this.purchaseId = purchaseId;
  }

  downloadFile(file: AttachedFile): void {
    const filename = file.filename;
    const fileId = file.id;
    this.api.post(
      `purchases/customer/${this.purchaseId}/documents/${fileId}/download`,
      {},
      { responseType: 'blob' })
      .subscribe(data => {
        saveAs(data, filename);
      });
  }
}

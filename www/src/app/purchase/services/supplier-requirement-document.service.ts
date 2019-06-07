import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FileItem, FileUploader } from "ng2-file-upload";
import { AttachedFile } from "../models/attached-file";
import { ActivatedRoute } from "@angular/router";
import { TokenService } from "stdlib-ng/dist/core";
import { Observable } from "rxjs";
import { Uuid } from "../../cart/models/uuid";
import { saveAs } from 'file-saver/src/FileSaver';
import { DocumentTypes } from "../enums/document-types";


@Injectable({
  providedIn: 'root'
})

export class SupplierRequirementDocumentService {

  attachedFiles?: AttachedFile[] = [];
  uploader: FileUploader;

  protected purchaseId: Uuid;

  constructor(
    private api: HttpClient,
    private route: ActivatedRoute,
    private token: TokenService,
  ) {
  }

  /**
   * Инициирует загрузчик файлов и получает список файлов для предложения
   *
   * @param purchaseId
   */
  init(purchaseId: Uuid) {
    this.purchaseId = purchaseId;
    const authToken = this.token.getTokenType() + ' ' + this.token.getToken();

    this.uploader = new FileUploader({
      url: `/api/purchases/supplier/${purchaseId}/documents/upload`,
      authToken: authToken
    });

    this.getDocuments().subscribe((documents: AttachedFile[]) => {
      this.attachedFiles = documents;
    });
  }

  getDocuments(): Observable<AttachedFile[]> {
    const url = `purchases/supplier/${this.purchaseId}/documents`;
    return this.api.get<AttachedFile[]>(url, {});
  }

  /**
   * Загружаем сразу файлы на сервер после выбора их в компоененте.
   */
  onFileSelected() {
    // помечаем, что загружаем справку о бенефициарах
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('docType', DocumentTypes.CERTIFICATE_OF_BENEFICIARIES);
    };

    this.uploader.queue.forEach((fileItem) => {
      fileItem.onSuccess = (response: string) => {
        let res;
        try {
          res = JSON.parse(response);
        } catch (e) {
          res = { success: false };
        }

        if (res.success !== true) {
          this.uploadError(fileItem);
        }

        const uploadedFile = res.data;

        this.attachedFiles.push(uploadedFile);
      };

      fileItem.onError = () => {
        this.uploadError(fileItem);
      };
    });

    this.uploader.uploadAll();
  }

  downloadFile(file) {
    const filename = file.filename;
    return this.api.post(
      `purchases/supplier/${this.purchaseId}/documents/${file.id}/download`,
      {},
      {
        responseType: 'blob'
      })
      .subscribe(data => {
        saveAs(data, filename);
      });
  }

  deleteFile(file) {
    this.api.post(
      `purchases/supplier/${this.purchaseId}/documents/${file.id}/delete`,
      {}).subscribe(() => {
      this.attachedFiles = this.attachedFiles.filter(
        (item: AttachedFile) => item.id !== file.id
      );
    });
  }

  protected uploadError(fileItem: FileItem) {
    this.uploader.removeFromQueue(fileItem);
    alert('При загрузке файла "' + fileItem.file.name + '" возникла ошибка');
  }
}

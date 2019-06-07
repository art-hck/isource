import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FileItem, FileUploader } from "ng2-file-upload";
import { AttachedFile } from "../models/attached-file";
import { ActivatedRoute } from "@angular/router";
import { TokenService } from "stdlib-ng/dist/core";
import { Uuid } from "../../cart/models/uuid";
import { saveAs } from 'file-saver/src/FileSaver';
import { DocumentTypes } from "../enums/document-types";
import { Observable, Subject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class CustomerOrderDocumentService {

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
      url: `/api/orders/customer/${purchaseId}/documents/upload`,
      authToken: authToken
    });
  }

  /**
   * Загружаем сразу файлы на сервер после выбора их в компоненте.
   */
  onFileSelected() {
    const me = this;

    return new Observable(function(observer) {
      // помечаем, что загружаем договор
      me.uploader.onBuildItemForm = (fileItem: any, form: any) => {
        form.append('docType', DocumentTypes.CONTRACT);
      };

      me.uploader.queue.forEach((fileItem) => {
        fileItem.onSuccess = (response: string) => {
          let res;
          try {
            res = JSON.parse(response);
          } catch (e) {
            res = { success: false };
          }

          if (res.success !== true) {
            observer.error();
            me.uploadError(fileItem);
          }
          observer.next();

          const uploadedFile = res.data;

          me.attachedFiles.push(uploadedFile);
        };

        fileItem.onError = () => {
          observer.error();
          me.uploadError(fileItem);
        };
      });

      me.uploader.uploadAll();
    });
  }

  protected uploadError(fileItem: FileItem) {
    this.uploader.removeFromQueue(fileItem);
    alert('При загрузке файла "' + fileItem.file.name + '" возникла ошибка');
  }
}

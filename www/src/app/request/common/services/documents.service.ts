import {HttpClient} from "@angular/common/http";
import { saveAs } from 'file-saver/src/FileSaver';
import {Injectable} from "@angular/core";
import {AttachedFile} from "../models/attached-file";


@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  downloadFile(file: AttachedFile): void {
    console.log(file);
    const fileName = file.filename;
    const fileId = file.id;
    this.api.post(
      `requests/documents/${fileId}/download`,
      {},
      { responseType: 'blob' })
      .subscribe(data => {
        saveAs(data, fileName);
      });
  }
}

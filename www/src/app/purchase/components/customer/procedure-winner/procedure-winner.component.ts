import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {PurchaseWinnerInfo} from "../../../models/purchase-winner-info";
import { AttachedFile } from "../../../models/attached-file";
import {Uuid} from "../../../../cart/models/uuid";

@Component({
  selector: 'app-procedure-winner',
  templateUrl: './procedure-winner.component.html',
  styleUrls: ['./procedure-winner.component.css']
})
export class ProcedureWinnerComponent implements OnInit {

  @Input() winnerInfo?: PurchaseWinnerInfo;
  @Input() documents: AttachedFile[];
  @Input() purchaseId?: Uuid;

  @Output() downloadClick = new EventEmitter<AttachedFile>();
  @Output() acceptDocumentClick = new EventEmitter<any>();
  @Output() declineDocumentClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Функция проверяет статус документа, утверждён он или нет
   */
  checkIfDocumentAccepted(): boolean {
    return this.winnerInfo.beneficiariesDocuments.resolution;
  }

  showResolutionButtons(): boolean {
    return this.winnerInfo.beneficiariesDocuments.resolution === null;
  }

  onDeclineDocument(): void {
    this.declineDocumentClick.emit();
  }

  onAcceptDocument(): void {
    this.acceptDocumentClick.emit();
  }

  getDocumentStateLabel(): string {
    return this.checkIfDocumentAccepted() === true ? 'Документ утверждён' : 'Документ отклонён';
  }

  onDownloadFile() {
    this.downloadClick.emit(this.winnerInfo.beneficiariesDocuments.files[0]);
  }
}

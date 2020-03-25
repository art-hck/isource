import { Component, Input } from '@angular/core';
import { ContragentInfo } from "../../models/contragent-info";
import { ContragentService } from "../../services/contragent.service";

@Component({
  selector: 'app-contragent-info',
  templateUrl: './contragent-info.component.html',
  styleUrls: ['./contragent-info.component.scss']
})
export class ContragentInfoComponent {

  @Input() contragent: ContragentInfo;
  @Input() modalView = true;

  constructor(
    private getContragentService: ContragentService
  ) { }

  onDownloadPrimaInformReport(): void {
    this.getContragentService.downloadPrimaInformReport(this.contragent.id);
  }

  getLoaderState() {
    return this.getContragentService.loading;
  }
}

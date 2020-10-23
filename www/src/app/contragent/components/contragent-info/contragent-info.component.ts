import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { ContragentInfo } from "../../models/contragent-info";
import { ContragentService } from "../../services/contragent.service";
import { ContragentRoleLabels } from "../../dictionaries/currency-labels";
import { saveAs } from 'file-saver/src/FileSaver';

@Component({
  selector: 'app-contragent-info',
  templateUrl: './contragent-info.component.html',
  styleUrls: ['./contragent-info.component.scss']
})
export class ContragentInfoComponent {

  @Input() contragent: ContragentInfo;
  @Input() modalView = true;
  downloading: boolean;

  readonly roleLabel = ContragentRoleLabels;

  constructor(
    public getContragentService: ContragentService,
    private cd: ChangeDetectorRef,
  ) { }

  onDownloadPrimaInformReport(): void {
    this.downloading = true;

    this.getContragentService.downloadPrimaInformReport(this.contragent.id).subscribe(data => {
      saveAs(data, `PrimaInformReport${this.contragent.id}.pdf`);
      this.downloading = false;
      this.cd.detectChanges();
    }, (error: any) => {
      let msg = 'Ошибка при получении отчета';
      this.downloading = false;
      this.cd.detectChanges();
      if (error && error.error && error.error.detail) {
        msg = `${msg}: ${error.error.detail}`;
      }
      alert(msg);
    });
  }
}

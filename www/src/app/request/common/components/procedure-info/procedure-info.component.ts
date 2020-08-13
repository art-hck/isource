import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Procedure } from "../../../back-office/models/procedure";
import moment from "moment";
import { APP_CONFIG, GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";

@Component({
  selector: 'app-procedure-info',
  templateUrl: './procedure-info.component.html',
  styleUrls: ['./procedure-info.component.scss']
})
export class ProcedureInfoComponent {

  @Input() procedure: Procedure;
  @Output() bargain = new EventEmitter();
  @Output() prolong = new EventEmitter();

  limit = 5;
  showAllPositions: boolean;
  showAllContragents: boolean;

  get link(): string {
    return this.appConfig.procedure.url + this.procedure.procedureId;
  }

  get resultLink(): string {
    return this.appConfig.procedure.resultUrl + this.procedure.lotId;
  }

  constructor(
    @Inject(APP_CONFIG)
    private appConfig: GpnmarketConfigInterface,
    ) {
  }

  finished(procedure: Procedure): boolean {
    return moment(procedure?.dateEndRegistration).isBefore();
  }

  getProcedurePositions() {
    // Если showAllPositions = true или не указан limit — возвращаем всё
    return this.procedure.positions.slice(0, this.showAllPositions ? this.procedure.positions.length : (this.limit || this.procedure.positions.length));
  }

  getProcedureContragents(): ContragentShortInfo[] {
    let flatContragents: ContragentShortInfo[] = this.procedure.positions
      .filter(position => position.contragent)
      .reduce((contragents, position) => [...contragents, position.contragent], []);

    // Убираем из массива дублирующихся контрагентов
    flatContragents = flatContragents.filter((value, index, array) =>
      !array.filter((v, i) => JSON.stringify(value) === JSON.stringify(v) && i < index).length);

    return flatContragents.slice(0, this.showAllContragents ? flatContragents.length : (this.limit || flatContragents.length));
  }
}

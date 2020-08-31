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
    // Если showAllPositions = true или не указан limit — возвращаем всё
    return this.procedure.privateAccessContragents.slice(0, this.showAllContragents ? this.procedure.privateAccessContragents.length : (this.limit || this.procedure.privateAccessContragents.length));
  }

  dateEndRegistrationFinished(): boolean {
    return moment(this.procedure?.dateEndRegistration).isBefore();
  }

  dateSummingUpFinished(): boolean {
    return moment(this.procedure?.dateSummingUp).isBefore();
  }

  procedureIsFinished(): boolean {
    return this.dateEndRegistrationFinished() && this.dateSummingUpFinished();
  }

  procedureIsRetrade(): boolean {
    return this.procedure?.isRetrade;
  }

  canRetradeProcedure(): boolean {
    return this.procedure?.canRetrade;
  }

  prolongButtonIsDisabled(): boolean {
    return this.procedureIsFinished() || this.procedureIsRetrade();
  }

  // Дизейблим кнопку уторговывания, если процедура завершена полностью
  // или если по процедуре объявлено уторговывание
  // или если по процедуре идёт приём предложений (дата приёма заявок ещё не наступила) и при этом не объявлено уторговывание
  // или если процедуру нельзя уторговать, т.к. нет позиций с 2 и более предложениями
  retradeButtonIsDisabled(): boolean {
    return this.procedureIsFinished() || (this.procedureIsRetrade() && !this.dateEndRegistrationFinished()) || !this.dateEndRegistrationFinished() || !this.canRetradeProcedure();
  }
}

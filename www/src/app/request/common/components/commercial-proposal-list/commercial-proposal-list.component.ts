import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { PositionStatus } from "../../enum/position-status";
import * as moment from "moment";
import { Uuid } from "../../../../cart/models/uuid";
import { AbstractControl, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { RequestPositionList } from "../../models/request-position-list";
import { ActivatedRoute } from "@angular/router";
import { APP_CONFIG, GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { FeatureService } from "../../../../core/services/feature.service";
import { CommercialProposalsService } from "../../../back-office/services/commercial-proposals.service";
import { Request } from "../../models/request";
import { Store } from "@ngxs/store";
import { ProcedureAction } from "../../../back-office/models/procedure-action";

@Component({
  selector: 'app-request-commercial-proposal-list',
  templateUrl: './commercial-proposal-list.component.html',
  styleUrls: ['./commercial-proposal-list.component.scss']
})
export class CommercialProposalListComponent implements OnInit {

  form: FormGroup;
  requestId: Uuid;
  appConfig: GpnmarketConfigInterface;
  files: File[] = [];

  isFolded = [];

  @Input() request: Request;
  @Input() requestPositions: RequestPosition[] = [];
  @Input() suppliers: ContragentList[];
  @Output() sentForAgreement = new EventEmitter<{ requestId: Uuid, selectedPositions: RequestPosition[] }>();
  @Output() addOffer = new EventEmitter<RequestPosition>();
  @Output() cancelOffer = new EventEmitter<RequestPosition>();
  @Output() addOffersTemplate = new EventEmitter<File[]>();
  @Output() editOffer = new EventEmitter<{ position, linkedOffer }>();
  @Output() procedureAction = new EventEmitter<ProcedureAction>();
  @Output() downloadReport = new EventEmitter();
  @Output() refresh = new EventEmitter();

  supplier: ContragentList;
  positionProlongedProcedure: RequestPosition;

  get formPositions() {
    return this.form.get('positions') as FormArray;
  }

  /**
   * Время в течение которого бэкофис может отозвать КП (в секундах)
   */
  public durationCancelPublish = 10 * 60;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private offersService: CommercialProposalsService,
    public featureService: FeatureService,
    public user: UserInfoService,
    private store: Store,
    @Inject(APP_CONFIG) appConfig: GpnmarketConfigInterface) {
    this.appConfig = appConfig;
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      checked: false,
      positions: this.fb.array([], CustomValidators.oneOrMoreSelected)
    });

    this.requestPositions.map(position => {
      const formGroup = this.createFormGroupPosition(position);
      this.formPositions.push(formGroup);
      if (!this.positionCanBeSelected(position)) {
        formGroup.get('checked').disable();
      }
    });
  }

  createFormGroupPosition(position: RequestPositionList) {
    return this.fb.group({
      checked: false,
      position: position
    });
  }

  positionCanBeSelected(requestPosition: RequestPosition): boolean {
    return (
      requestPosition.linkedOffers.length !== 0 &&
      requestPosition.status === PositionStatus.PROPOSALS_PREPARATION
    );
  }

  canAddOffer(requestPosition: RequestPosition): boolean {
    return requestPosition.status === PositionStatus.PROPOSALS_PREPARATION;
  }

  positionIsSentForAgreement(requestPosition: RequestPosition): boolean {
    return requestPosition.status === PositionStatus.RESULTS_AGREEMENT;
  }

  positionWithWinner(requestPosition: RequestPosition): boolean {
    return requestPosition.linkedOffers.some(linkedOffer => linkedOffer.isWinner === true);
  }

  correctDeliveryDate(linkedOfferDeliveryDate: string, requestPositionDeliveryDate: string): boolean {
    if (!requestPositionDeliveryDate) {
      return true;
    }

    const controlDate = moment(linkedOfferDeliveryDate);
    const validationDate = moment(requestPositionDeliveryDate);

    return controlDate.isSameOrBefore(validationDate);
  }

  findSupplier(supplierId: Uuid): ContragentList {
    this.supplier = this.suppliers.find(supplier => supplier.id === supplierId);
    return this.supplier;
  }

  submit(controls: AbstractControl[]) {
    const selectedPositions = controls.filter(control => control.get('checked').value).map(control => control.get('position').value);
    this.sentForAgreement.emit({requestId: this.requestId, selectedPositions: selectedPositions});
  }

  newCommercialProposal(position) {
    this.addOffer.emit(position);
  }

  isLinkedOfferClickable(position): boolean {
    return (!this.positionWithWinner(position) && !this.positionIsSentForAgreement(position));
  }

  editCommercialProposal(position, linkedOffer): void {
    if (!this.isLinkedOfferClickable(position)) {
      return;
    }

    this.editOffer.emit({position, linkedOffer});
  }

  preventParentClick(ev): void {
    ev.preventDefault();
    ev.stopPropagation();
  }

  availableCancelPublishOffers(requestPosition: RequestPosition) {
    return requestPosition.status === PositionStatus.RESULTS_AGREEMENT
      && this.getStatusChangeDuration(requestPosition) < this.durationCancelPublish;
  }

  positionHasProcedure(requestPosition: RequestPosition): boolean {
    return requestPosition.hasProcedure;
  }

  positionHasFinishedProcedure(requestPosition: RequestPosition): boolean {
    return requestPosition.procedureEndDate && !requestPosition.hasProcedure;
  }

  getProcedureLink({ procedureId }: RequestPosition): string {
    return this.appConfig.procedure.url + procedureId;
  }

  getProcedureResultLink({ procedureLotId }: RequestPosition): string {
    return this.appConfig.procedure.resultUrl + procedureLotId;
  }

  /**
   * Возвращает время в секундах, которое прошло с момента смены статуса КП
   * @param requestPosition
   */
  protected getStatusChangeDuration(requestPosition: RequestPosition): number {
    return moment().diff(moment(requestPosition.statusChangedDate), 'seconds');
  }

  onCancelPublishOffers(requestPosition: RequestPosition) {
    this.cancelOffer.emit(requestPosition);
  }

  isOverflow(positionCard: HTMLElement) {
    return positionCard.scrollHeight > positionCard.clientHeight + 30;
  }

  onDownloadOffersTemplate(): void {
    this.offersService.downloadOffersTemplate(this.request);
  }

  onDownloadAnalyticalReport(): void {
    this.downloadReport.emit();
  }

  onChangeFilesList(files: File[]): void {
    this.files = files;
  }

  onSendOffersTemplateFilesClick() {
    this.addOffersTemplate.emit(this.files);
  }
}

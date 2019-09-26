import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { ActivatedRoute, Router } from "@angular/router";
import { TechnicalProposalsService } from "../../services/technical-proposals.service";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { RequestPositionList } from "../../../common/models/request-position-list";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NotificationService } from "../../../../shared/services/notification.service";
import { TechnicalProposalsStatuses } from "../../../common/enum/technical-proposals-statuses";
import { TechnicalProposalPositionStatuses } from 'src/app/request/common/enum/technical-proposal-position-statuses';
import { TechnicalProposalPosition } from 'src/app/request/common/models/technical-proposal-position';

@Component({
  selector: 'app-add-technical-proposals',
  templateUrl: './add-technical-proposals.component.html',
  styleUrls: ['./add-technical-proposals.component.scss']
})
export class AddTechnicalProposalsComponent implements OnInit {

  requestId: Uuid;
  request: Request;
  technicalProposals: TechnicalProposal[];
  documentsForm: FormGroup;
  technicalProposal: TechnicalProposal;
  technicalProposalsPositions: RequestPositionList[];

  tpSupplierName: string;

  selectedTechnicalProposalPositionsIds = [];
  showAddTechnicalProposalModal = false;
  uploadedFiles: File[] = [];

  protected editableStatuses = [
    TechnicalProposalPositionStatuses.NEW.valueOf(),
    TechnicalProposalPositionStatuses.EDITED.valueOf()
  ];

  protected completedStatuses = [
    TechnicalProposalPositionStatuses.ACCEPTED.valueOf(),
    TechnicalProposalPositionStatuses.DECLINED.valueOf()
  ];

  @ViewChild('technicalProposalListElement', { static: false }) technicalProposalListElement: ElementRef;

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private requestService: RequestService,
    private technicalProposalsService: TechnicalProposalsService
  ) { }

  ngOnInit() {
    this.documentsForm = this.formBuilder.group({
      documents: [null]
    });

    this.requestId = this.route.snapshot.paramMap.get('id');

    this.updateRequestInfo();
    this.getTechnicalProposals();
    this.getPositionsListForTp();
  }

  onRequestsClick() {
    this.router.navigateByUrl(`requests/backoffice`).then(r => {});
  }

  onRequestClick() {
    this.router.navigateByUrl(`requests/backoffice/${this.request.id}`).then(r => {});
  }

  /**
   * Подготовка модального окна для добавления ТП
   */
  onShowAddTechnicalProposalModal(): void {
    this.selectedTechnicalProposalPositionsIds = [];
    this.uploadedFiles = [];

    const technicalProposal = new TechnicalProposal();
    technicalProposal.id = null;
    this.technicalProposal = technicalProposal;
    this.tpSupplierName = this.technicalProposal.name;

    this.showAddTechnicalProposalModal = true;
  }

  /**
   * Подготовка модального окна для редактирования ТП
   *
   * @param technicalProposal
   */
  onShowEditTechnicalProposalModal(technicalProposal): void {
    this.selectedTechnicalProposalPositionsIds = [];
    this.uploadedFiles = [];

    this.technicalProposal = technicalProposal;
    this.tpSupplierName = this.technicalProposal.name;

    this.technicalProposal.positions.map(e => {
      this.selectedTechnicalProposalPositionsIds.push(e.position.id);
    });

    this.showAddTechnicalProposalModal = true;
  }

  isReadyToSendForApproval(technicalProposal: TechnicalProposal): boolean {
    if (technicalProposal) {
      return (technicalProposal.positions.length > 0 &&
              technicalProposal.positions.every(position => position.manufacturingName !== "")) ||
              technicalProposal.documents.length > 0;
    }
  }

  onSendForApproval(technicalProposal: TechnicalProposal): void {
    this.technicalProposalsService.sendToAgreement(this.requestId, technicalProposal.id, technicalProposal).subscribe(
      (data) => {
        this.getTechnicalProposals();
      }
    );
  }

  protected updateRequestInfo(): void {
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
  }

  protected getTechnicalProposals(): void {
    this.technicalProposalsService.getTechnicalProposalsList(this.requestId).subscribe(
      (data: TechnicalProposal[]) => {
        this.technicalProposals = data;
      }
    );
  }

  /**
   * Обновление заводского наименования позиции в карточке ТП
   *
   * @param tpPosition
   * @param tpId
   * @param value
   */
  updateTpPositionManufacturingName(tpPosition, tpId: Uuid, value: string): void {
    const tpPositionInfo = {
      position: {
        id: tpPosition.position.id
      },
      manufacturingName: value
    };

    this.technicalProposalsService.updateTpPositionManufacturingName(
      this.requestId,
      tpId,
      tpPositionInfo
    ).subscribe(() => {
      this.getTechnicalProposals();
    });
  }

  /**
   * Создание технического предложения
   */
  onAddTechnicalProposal(): void {
    const technicalProposal = {
      name: this.tpSupplierName,
      positions: this.selectedTechnicalProposalPositionsIds,
    };

    this.technicalProposalsService.addTechnicalProposal(this.requestId, technicalProposal).subscribe(
      (tpData: TechnicalProposal) => {
        if (!this.uploadedFiles.length) {
          this.getTechnicalProposals();
          return;
        }

        const filesToUpload = this.technicalProposalsService.convertModelToFormData(
          this.documentsForm.value,
          null,
          'files'
        );

        this.uploadSelectedDocuments(this.requestId, tpData.id, filesToUpload);
      },
      () => {
        this.notificationService.toast('Не удалось создать техническое предложение');
      }
    );

    this.showAddTechnicalProposalModal = false;
    this.tpSupplierName = "";
  }

  uploadSelectedDocuments(requestId: Uuid, tpId: Uuid, formData): void {
    this.technicalProposalsService.uploadSelectedDocuments(requestId, tpId, formData).subscribe(
      () => {
        this.getTechnicalProposals();
      }, () => {
        this.notificationService.toast(
          'Не удалось создать техническое предложение (ошибка загрузки документов)',
          'error'
        );
      }
    );
  }

  /**
   * Редактирование Технического предложения
   */
  onSaveTechnicalProposal(): void {
    const selectedPositionsArray = [];
    this.selectedTechnicalProposalPositionsIds.map(posId => {
      selectedPositionsArray.push(posId);
    });

    const technicalProposal = {
      id: this.technicalProposal.id,
      name: this.tpSupplierName,
      positions: selectedPositionsArray,
    };

    this.technicalProposalsService.updateTechnicalProposal(this.requestId, technicalProposal).subscribe(
      (tpData: TechnicalProposal) => {
        if (!this.uploadedFiles.length) {
          this.getTechnicalProposals();
          return;
        }

        const filesToUpload = this.technicalProposalsService.convertModelToFormData(
          this.documentsForm.value,
          null,
          'files'
        );

        this.uploadSelectedDocuments(this.requestId, tpData.id, filesToUpload);
      },
      () => {
        this.notificationService.toast('Не удалось сохранить техническое предложение');
      }
    );

    this.showAddTechnicalProposalModal = false;
  }

  onDocumentSelected(uploadedFiles, documentsForm): void {
    documentsForm.get('documents').setValue(uploadedFiles);
  }


  /**
   * Получение списка позиций для ТП
   */
  getPositionsListForTp(): void {
    this.technicalProposalsService.getTechnicalProposalsPositionsList(this.requestId).subscribe(
      (positions: RequestPositionList[]) => {
        this.technicalProposalsPositions = positions;
      }
    );
  }

  /**
   * Действие при отмечании чекбокса позиции в списке
   * @param position
   */
  onTechnicalProposalPositionSelected(position: RequestPositionList): void {
    if (this.selectedTechnicalProposalPositionsIds.indexOf(position.id) > -1) {
      for (let i = 0; i < this.selectedTechnicalProposalPositionsIds.length; i++) {
        if (this.selectedTechnicalProposalPositionsIds[i] === position.id) {
          this.selectedTechnicalProposalPositionsIds.splice(i, 1);
        }
      }
    } else {
      this.selectedTechnicalProposalPositionsIds.push(position.id);
    }
  }

  /**
   * Функция проверяет, должна ли быть отмечена позиция в списке в модальном окне
   * @param technicalProposalPosition
   */
  checkIfPositionIsChecked(technicalProposalPosition: RequestPositionList): boolean {
    return (this.selectedTechnicalProposalPositionsIds.indexOf(technicalProposalPosition.id) > -1);
  }

  /**
   * Функция проверяет, находится ли модальное окно в режиме редактирования или в режиме создания нового ТП
   * @param technicalProposal
   */
  tpModalInEditMode(technicalProposal: TechnicalProposal): boolean {
    return technicalProposal.id !== null;
  }

  /**
   * Функция проверяет, является ли техническое предложение свежесозданным
   * @param technicalProposal
   */
  tpIsNew(technicalProposal: TechnicalProposal): boolean {
    return technicalProposal.status === TechnicalProposalsStatuses.NEW;
  }

  tpHasEditablePositions(tp: TechnicalProposal): boolean {
    return tp.positions.some((position) => {
      return this.isEditablePosition(position);
    });
  }

  isEditablePosition(position: TechnicalProposalPosition): boolean {
    return this.editableStatuses.indexOf(position.status) >= 0;
  }

  /**
   * Функция проверяет, приступил ли заказчик к обработке ТП (принято решение хотя бы по одной позиции)
   * @param technicalProposal
   */
  tpIsOnReview(technicalProposal: TechnicalProposal): boolean {
    return technicalProposal.status !== TechnicalProposalsStatuses.NEW &&
           technicalProposal.positions.some(position => position.status !== "NEW");
  }

  /**
   * Функция проверяет, отклонил ли заказчик хотя бы одну позицию
   * @param technicalProposal
   */
  tpHasDeclinedPosition(technicalProposal: TechnicalProposal) {
    return technicalProposal.positions.some(position => position.status === "DECLINED");
  }


  tpStatusLabel(technicalProposal: TechnicalProposal): string {
    if (technicalProposal.positions.some((position) => {
      return position.status === TechnicalProposalPositionStatuses.REVIEW.valueOf()
    })) {
      return "Согласование заказчиком";
    }

    if (technicalProposal.positions.every((position) => {
      return this.completedStatuses.indexOf(position.status) >= 0
    })) {
      return "Завершено согласование заказчиком";
    }

    return "";
  }

}

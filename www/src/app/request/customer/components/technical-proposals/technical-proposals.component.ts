import { Component, OnInit } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Request } from "../../../common/models/request";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { TechnicalProposalsService } from "../../services/technical-proposals.service";
import { TechnicalProposalPosition } from "../../../common/models/technical-proposal-position";
import { NotificationService } from "../../../../shared/services/notification.service";
import { TechnicalProposalPositionStatuses } from 'src/app/request/common/enum/technical-proposal-position-statuses';
import { ContragentInfo } from "../../../../contragent/models/contragent-info";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { TechnicalProposalsStatuses } from "../../../common/enum/technical-proposals-statuses";
import { UxgBreadcrumbsService } from "uxg";
import { RequestPosition } from "../../../common/models/request-position";

@Component({
  selector: 'app-technical-proposals',
  templateUrl: './technical-proposals.component.html',
  styleUrls: ['./technical-proposals.component.scss']
})
export class TechnicalProposalsComponent implements OnInit {
  requestId: Uuid;
  request: Request;
  technicalProposals: TechnicalProposal[];
  selectedTechnicalProposalsPositions: TechnicalProposalPosition[][] = [];
  contragent: ContragentInfo;

  constructor(
    private bc: UxgBreadcrumbsService,
    private route: ActivatedRoute,
    protected router: Router,
    private requestService: RequestService,
    private technicalProposalsService: TechnicalProposalsService,
    private notificationService: NotificationService,
    protected getContragentService: ContragentService
  ) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.updateRequestInfo();
    this.getTechnicalProposals();

  }

  protected updateRequestInfo() {
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/customer/" },
          { label: `Заявка №${this.request.number }`, link: "/requests/customer/" + this.request.id }
        ];
      }
    );
  }

  protected getTechnicalProposals() {
    this.technicalProposalsService.getTechnicalProposalsList(this.requestId).subscribe(
      (data: TechnicalProposal[]) => {
        this.technicalProposals = data;
        for (let i = 0; i < this.technicalProposals.length; i++) {
          this.selectedTechnicalProposalsPositions[i] = [];
        }
      }
    );
  }

  onSelectPosition(i, technicalProposalPosition: TechnicalProposalPosition) {
    const index = this.selectedTechnicalProposalsPositions[i].indexOf(technicalProposalPosition);

    if (index === -1) {
      this.selectedTechnicalProposalsPositions[i].push(technicalProposalPosition);
    } else {
      this.selectedTechnicalProposalsPositions[i].splice(index, 1);
    }
  }

  toAcceptTechnicalProposals(technicalProposalId: Uuid, selectedTechnicalProposalsPositions: TechnicalProposalPosition[]) {
    this.technicalProposalsService.acceptTechnicalProposals(this.requestId, technicalProposalId, selectedTechnicalProposalsPositions).subscribe(
      () => {
        this.getTechnicalProposals();
        const toastText = this.selectedTechnicalProposalsPositions.length === 1 ?
          'Технические предложения для позиций согласованы' :
          'Техническое предложение для позиции согласовано';
        this.notificationService.toast(toastText);
        this.selectedTechnicalProposalsPositions = [];
      }
    );
  }

  toDeclineTechnicalProposals(technicalProposalId: Uuid, selectedTechnicalProposalsPositions: TechnicalProposalPosition[]) {
    this.technicalProposalsService.declineTechnicalProposals(this.requestId, technicalProposalId, selectedTechnicalProposalsPositions).subscribe(
      () => {
        this.getTechnicalProposals();
        const toastText = this.selectedTechnicalProposalsPositions.length === 1 ?
          'Технические предложения для позиций отклонены' :
          'Техническое предложение для позиции отклонено';
        this.notificationService.toast(toastText, 'error');
        this.selectedTechnicalProposalsPositions = [];
      }
    );
  }

  onSelectAllPositions(event, i, technicalProposalPositions: TechnicalProposalPosition[]): void {
    // TODO: 2019-11-06 Указать тип аргумента event
    if (event.target.checked === true) {
      this.selectedTechnicalProposalsPositions[i] = [];
      technicalProposalPositions.forEach(technicalProposalPosition => {
        if (this.isPositionSelectorAvailable(technicalProposalPosition)) {
          technicalProposalPosition.checked = true;
          this.selectedTechnicalProposalsPositions[i].push(technicalProposalPosition);
        }
      });
    } else {
      this.selectedTechnicalProposalsPositions[i] = [];
      technicalProposalPositions.forEach(technicalProposalPosition => {
        technicalProposalPosition.checked = null;
      });
    }
  }

  areAllPositionsChecked(technicalProposalPositions: TechnicalProposalPosition[]) {
    return !technicalProposalPositions.some(
      technicalProposalPosition => technicalProposalPosition.checked !== true
    );
  }

  hasSelectablePositions(technicalProposalPositions: TechnicalProposalPosition[]): boolean {
    return technicalProposalPositions.some(technicalProposalPosition =>
      this.isPositionSelectorAvailable(technicalProposalPosition));
  }

  isPositionSelectorAvailable(tpPosition: TechnicalProposalPosition): boolean {
    const selectorAvailableStatues = [
      TechnicalProposalPositionStatuses.REVIEW.valueOf()
    ];
    return selectorAvailableStatues.indexOf(tpPosition.status) >= 0;
  }

  isPositionStatusIndicatorAvailable(tpPosition: TechnicalProposalPosition): boolean {
    return !this.isPositionSelectorAvailable(tpPosition);
  }

  isResolutionButtonsAvailable(i: number): boolean {
    return (
      this.selectedTechnicalProposalsPositions &&
      this.selectedTechnicalProposalsPositions[i] &&
      this.selectedTechnicalProposalsPositions[i].length > 0
    );
  }

  isSendToReview(technicalProposal: TechnicalProposal): boolean {
    return technicalProposal.status === TechnicalProposalsStatuses.SENT_TO_REVIEW;
  }
}

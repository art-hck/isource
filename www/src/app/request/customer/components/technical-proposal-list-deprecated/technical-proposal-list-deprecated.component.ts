import { Component, OnInit } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Request } from "../../../common/models/request";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { TechnicalProposalsService } from "../../services/technical-proposals.service";
import { TechnicalProposalPosition } from "../../../common/models/technical-proposal-position";
import { Store } from "@ngxs/store";
import { TechnicalProposalPositionStatus } from 'src/app/request/common/enum/technical-proposal-position-status';
import { ContragentInfo } from "../../../../contragent/models/contragent-info";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { TechnicalProposalsStatus } from "../../../common/enum/technical-proposals-status";
import { UxgBreadcrumbsService } from "uxg";
import { ToastActions } from "../../../../shared/actions/toast.actions";

@Component({
  selector: 'app-request-technical-proposal-list-deprecated',
  templateUrl: './technical-proposal-list-deprecated.component.html',
  styleUrls: ['./technical-proposal-list-deprecated.component.scss']
})
export class TechnicalProposalListDeprecatedComponent implements OnInit {
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
    private store: Store,
    protected getContragentService: ContragentService
  ) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.updateRequestInfo();
    this.getTechnicalProposals();

  }

  protected updateRequestInfo() {
    this.requestService.getRequest(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/customer/" },
          { label: `Заявка №${this.request.number}`, link: "/requests/customer/" + this.request.id }
        ];
      }
    );
  }

  protected getTechnicalProposals() {
    this.technicalProposalsService.getTechnicalProposalsList(this.requestId, null).subscribe(
      (data: { entities: TechnicalProposal[], availableStatuses: string[] }) => {
        this.technicalProposals = data.entities;
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
        this.store.dispatch(new ToastActions.Success(toastText));
        this.selectedTechnicalProposalsPositions = [];
      }
    );
  }

  toDeclineTechnicalProposals(technicalProposalId: Uuid, selectedTechnicalProposalsPositions: TechnicalProposalPosition[]) {
    this.technicalProposalsService.declineTechnicalProposals(this.requestId, technicalProposalId, selectedTechnicalProposalsPositions, '—').subscribe(
      () => {
        this.getTechnicalProposals();
        const toastText = this.selectedTechnicalProposalsPositions.length === 1 ?
          'Технические предложения для позиций отклонены' :
          'Техническое предложение для позиции отклонено';
        this.store.dispatch(new ToastActions.Error(toastText));
        this.selectedTechnicalProposalsPositions = [];
      }
    );
  }

  onSelectAllPositions(checked: boolean, i, technicalProposalPositions: TechnicalProposalPosition[]): void {
    if (checked === true) {
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
      TechnicalProposalPositionStatus.REVIEW.valueOf()
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
    return technicalProposal.status === TechnicalProposalsStatus.SENT_TO_REVIEW;
  }
}

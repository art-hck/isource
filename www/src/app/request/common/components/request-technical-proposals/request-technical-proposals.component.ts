import { Component } from '@angular/core';
import {Uuid} from "../../../../cart/models/uuid";
import {Request} from "../../models/request";
import {TechnicalProposal} from "../../models/technical-proposal";
import {TechnicalProposalsService} from "../../../back-office/services/technical-proposals.service";
import {ActivatedRoute} from "@angular/router";
import {TechnicalProposalsStatusesLabels} from "../../dictionaries/technical-proposals-statuses-labels";
import {TechnicalProposalPositionStatuses} from "../../enum/technical-proposal-position-statuses";
import {TechnicalProposalPosition} from "../../models/technical-proposal-position";
import {Observable} from "rxjs";
import {TechnicalProposalsStatuses} from "../../enum/technical-proposals-statuses";

@Component({
  selector: 'app-request-technical-proposals',
  templateUrl: './request-technical-proposals.component.html',
  styleUrls: ['./request-technical-proposals.component.scss']
})
export class RequestTechnicalProposalsComponent {

  requestId: Uuid;
  request: Request;
  technicalProposals$: Observable<TechnicalProposal[]>;

  isFolded = [];

  protected editableStatuses = [
    TechnicalProposalPositionStatuses.NEW.valueOf(),
    TechnicalProposalPositionStatuses.EDITED.valueOf(),
    TechnicalProposalPositionStatuses.DECLINED.valueOf()
  ];

  constructor(
    private route: ActivatedRoute,
    private technicalProposalsService: TechnicalProposalsService
  ) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.technicalProposals$ = this.technicalProposalsService.getTechnicalProposalsList(this.requestId);

  }

  tpStatusLabel(technicalProposal: TechnicalProposal): string {
    return TechnicalProposalsStatusesLabels[technicalProposal.status];
  }

  isTpEditable(tp: TechnicalProposal): boolean {
    if (tp.status === TechnicalProposalsStatuses.SENT_TO_REVIEW) {
      return false;
    }
    return tp.positions.some((position) => {
      return this.isEditablePosition(position);
    });
  }

  isEditablePosition(position: TechnicalProposalPosition): boolean {
    return this.editableStatuses.indexOf(position.status) >= 0;
  }
}

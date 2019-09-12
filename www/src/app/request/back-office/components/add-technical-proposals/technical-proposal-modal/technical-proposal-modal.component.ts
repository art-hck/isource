import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TechnicalProposal } from "../../../../common/models/technical-proposal";
import { Uuid } from "../../../../../cart/models/uuid";
import { ActivatedRoute } from "@angular/router";
import { TechnicalProposalsService } from "../../../services/technical-proposals.service";
import { RequestPositionList } from "../../../../common/models/request-position-list";

@Component({
  selector: 'app-technical-proposal-modal',
  templateUrl: './technical-proposal-modal.component.html',
  styleUrls: ['./technical-proposal-modal.component.scss']
})
export class TechnicalProposalModalComponent implements OnChanges {

  @Input() technicalProposal: TechnicalProposal;

  requestId: Uuid;
  technicalProposalsPositions: RequestPositionList;

  constructor(
    private route: ActivatedRoute,
    private technicalProposalsService: TechnicalProposalsService
  ) { }

  ngOnChanges() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    // this.getPositionsListForTp();
  }

  // getPositionsListForTp() {
  //   this.technicalProposalsService.getTechnicalProposalsPositionsList(this.requestId).subscribe(
  //     (positions: RequestPositionList) => {
  //       this.technicalProposalsPositions = positions;
  //       // console.log(positions);
  //     }
  //   );
  // }


}

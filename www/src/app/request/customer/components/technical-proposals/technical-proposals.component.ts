import { Component, OnInit } from '@angular/core';
import {Uuid} from "../../../../cart/models/uuid";
import {Request} from "../../../common/models/request";
import {TechnicalProposal} from "../../../common/models/technical-proposal";
import {RequestPositionList} from "../../../common/models/request-position-list";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../back-office/services/request.service";
import {TechnicalProposalsService} from "../../../customer/services/technical-proposals.service";
import {RequestPosition} from "../../../common/models/request-position";
import {TechnicalProposalPosition} from "../../../common/models/technical-proposal-position";

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

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private requestService: RequestService,
    private technicalProposalsService: TechnicalProposalsService
  ) { }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.updateRequestInfo();
    this.getTechnicalProposals();
  }

  onRequestsClick() {
    this.router.navigateByUrl(`requests/customer`).then(r => {});
  }

  onRequestClick() {
    this.router.navigateByUrl(`requests/customer/${this.request.id}`).then(r => {});
  }

  protected updateRequestInfo() {
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
  }

  protected getTechnicalProposals() {
    this.technicalProposalsService.getTechnicalProposalsList(this.requestId).subscribe(
      (data: TechnicalProposal[]) => {
        this.technicalProposals = data;
        for(let i: number = 0; i< this.technicalProposals.length; i++) {
          this.selectedTechnicalProposalsPositions[i] = [];
        }
      }
    );
  }

  onSelectPosition(i, technicalProposalPosition: TechnicalProposalPosition) {
    console.log(technicalProposalPosition);
    const index = this.selectedTechnicalProposalsPositions[i].indexOf(technicalProposalPosition);

    if (index === -1) {
      this.selectedTechnicalProposalsPositions[i].push(technicalProposalPosition);
      console.log(this.selectedTechnicalProposalsPositions);
    } else {
      this.selectedTechnicalProposalsPositions[i].splice(index, 1);
      console.log(this.selectedTechnicalProposalsPositions);
    }
  }

  toAcceptTechnicalProposals(technicalProposalId: Uuid, selectedTechnicalProposalsPositions: TechnicalProposalPosition[]) {
    this.technicalProposalsService.acceptTechnicalProposals(this.requestId, technicalProposalId, selectedTechnicalProposalsPositions).subscribe(
      () => {
      }
    );
  }
  toDeclineTechnicalProposals(technicalProposalId: Uuid, selectedTechnicalProposalsPositions: TechnicalProposalPosition[]) {
    this.technicalProposalsService.declineTechnicalProposals(this.requestId, technicalProposalId, selectedTechnicalProposalsPositions).subscribe(
      () => {
      }
    );
  }
}

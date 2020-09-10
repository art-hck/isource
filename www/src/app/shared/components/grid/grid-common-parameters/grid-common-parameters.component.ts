import { Component, Input, OnInit } from '@angular/core';
import { TechnicalCommercialProposal } from "../../../../request/common/models/technical-commercial-proposal";
import { ProposalHelperService } from "../proposal-helper.service";
import { TechnicalCommercialProposalByPosition } from "../../../../request/common/models/technical-commercial-proposal-by-position";
import { getCurrencySymbol } from "@angular/common";

@Component({
  selector: 'app-grid-common-parameters',
  templateUrl: './grid-common-parameters.component.html',
  styleUrls: ['./grid-common-parameters.component.scss']
})
export class GridCommonParametersComponent implements OnInit {
  @Input() proposal: TechnicalCommercialProposal;
  @Input() proposalsByPos: TechnicalCommercialProposalByPosition[];
  @Input() showDocs = false;
  getCurrencySymbol = getCurrencySymbol;

  constructor(
    public helper: ProposalHelperService
  ) { }

  ngOnInit(): void {
  }

}

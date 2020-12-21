import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ProposalHelperService } from "../proposal-helper.service";
import { getCurrencySymbol } from "@angular/common";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { ProposalWithCommonInfo } from "../../../../request/common/models/proposal-with-common-info";
import { CommonProposal } from "../../../../request/common/models/common-proposal";
import { RequestPosition } from "../../../../request/common/models/request-position";
import { Uuid } from "../../../../cart/models/uuid";

@Component({
  selector: 'app-grid-common-parameters',
  templateUrl: './grid-common-parameters.component.html',
  styleUrls: ['./grid-common-parameters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridCommonParametersComponent implements OnInit {
  @HostBinding('class.app-row') appRow = true;
  @HostBinding('class.app-flex-column') appFlexColumn = true;
  @HostBinding('class.has-analogs')
  @Input() hasAnalogs = false;
  @Input() positions: RequestPosition[];
  @Input() proposal: CommonProposal;
  @Output() close = new EventEmitter();
  @Output() openEditModal = new EventEmitter<ProposalWithCommonInfo>();
  @Output() selectAll = new EventEmitter<ProposalWithCommonInfo>();
  @Input() showDocs: boolean;
  getCurrencySymbol = getCurrencySymbol;

  constructor(
    public helper: ProposalHelperService,
    public userInfoService: UserInfoService
  ) { }

  ngOnInit(): void {
  }

  edit(proposal: ProposalWithCommonInfo) {
    this.close.emit();
    this.openEditModal.emit(proposal);
  }

  getPosition(id: Uuid) {
    return this.positions.find(p => p.id === id);
  }

  canEditCommonParams() {
    return this.positions.every((position: RequestPosition) => ['RESULTS_AGREEMENT', 'TECHNICAL_COMMERCIAL_PROPOSALS_AGREEMENT',
      'WINNER_SELECTED', 'TCP_WINNER_SELECTED'].includes(position.status));
}
}

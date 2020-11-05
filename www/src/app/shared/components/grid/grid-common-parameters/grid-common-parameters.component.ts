import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ProposalHelperService } from "../proposal-helper.service";
import { getCurrencySymbol } from "@angular/common";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { ProposalWithCommonInfo } from "../../../../request/common/models/proposal-with-common-info";

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
  @Input() proposal: ProposalWithCommonInfo;
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
}

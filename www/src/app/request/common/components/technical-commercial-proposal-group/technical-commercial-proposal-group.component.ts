import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TechnicalCommercialProposalGroup } from "../../models/technical-commercial-proposal-group";
import { UserInfoService } from "../../../../user/service/user-info.service";

@Component({
  selector: 'app-technical-commercial-proposal-group',
  templateUrl: './technical-commercial-proposal-group.component.html',
  styleUrls: ['./technical-commercial-proposal-group.component.scss']
})
export class TechnicalCommercialProposalGroupComponent {
  @Input() technicalCommercialProposalGroup: TechnicalCommercialProposalGroup;
  @Input() editable: boolean;
  @Output() edit = new EventEmitter();
  folded = false;

  constructor(
    public user: UserInfoService
  ) {
  }

}

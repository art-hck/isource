import { ActivatedRoute } from "@angular/router";
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { tap } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { FeatureService } from "../../../../core/services/feature.service";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";

@Component({
  selector: 'technical-commercial-proposal-filter',
  templateUrl: './technical-commercial-proposal-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalFilterComponent {
}

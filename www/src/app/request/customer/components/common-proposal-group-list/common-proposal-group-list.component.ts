import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { ProposalGroup } from "../../../common/models/proposal-group";
import { delayWhen, scan, shareReplay, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { CommercialProposalsService } from "../../services/commercial-proposals.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestState } from "../../states/request.state";
import { RequestActions } from "../../actions/request.actions";
import { UxgBreadcrumbsService } from "uxg";
import { Select, Store } from "@ngxs/store";
import { Request } from "../../../common/models/request";
import { FormBuilder } from "@angular/forms";
import { ProposalGroupFilter } from "../../../common/models/proposal-group-filter";
import moment from "moment";

@Component({
  selector: 'app-common-proposal-group-list',
  templateUrl: './common-proposal-group-list.component.html'
})
export class CommonProposalGroupListComponent {
  @Input() request: Request;
  @Input() groups: ProposalGroup[];
  @Output() filter = new EventEmitter<ProposalGroupFilter>();
  readonly form = this.fb.group({ requestPositionName: null, createdDateFrom: null, createdDateTo: null });

  constructor(private fb: FormBuilder) {}

  emitFilter(filter: ProposalGroupFilter) {
    this.filter.emit({
      ...filter,
      createdDateFrom: filter.createdDateFrom ? moment(filter.createdDateFrom, 'DD.MM.YYYY').format('YYYY-MM-DD') : null,
      createdDateTo: filter.createdDateTo ? moment(filter.createdDateTo, 'DD.MM.YYYY').format('YYYY-MM-DD') : null
    });
  }
}

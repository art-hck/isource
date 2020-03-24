import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { TechnicalCommercialProposalGroupByPosition } from "../../../common/models/technical-commercial-proposal-group-by-position";
import { getCurrencySymbol } from "@angular/common";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { StateStatus } from "../../../common/models/state-status";
import { Observable } from "rxjs";
import { ClrModal } from "@clr/angular";
import Approve = TechnicalCommercialProposals.Approve;
import Reject = TechnicalCommercialProposals.Reject;

@Component({
  selector: "app-request-technical-commercial-proposal",
  templateUrl: './technical-commercial-proposal.component.html',
  styleUrls: ['technical-commercial-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalComponent {
  @Input() group: TechnicalCommercialProposalGroupByPosition;
  @Input() requestId: Uuid;
  @ViewChild("proposalModal", {static: false}) proposalModal: ClrModal;
  @Select(TechnicalCommercialProposalState.status) status$: Observable<StateStatus>;
  getCurrencySymbol = getCurrencySymbol;
  selectedProposalPosition: TechnicalCommercialProposalPosition;
  folded = false;

  get isReviewed() {
    return this.group.data.every(({ proposal }) => proposal.status === 'REVIEWED');
  }

  constructor(private store: Store) {}

  approve(proposalPosition: TechnicalCommercialProposalPosition) {
    this.store.dispatch(new Approve(this.requestId, proposalPosition));
  }

  reject() {
    this.store.dispatch(new Reject(this.requestId, this.group.position));
  }

  isDateValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return new Date(proposalPosition.deliveryDate) >= new Date(proposalPosition.position.deliveryDate);
  }

  isQuantityValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return proposalPosition.quantity >= proposalPosition.position.quantity;
  }

  trackByproposalPositionId = (i, {proposalPosition}) => proposalPosition.id;
}

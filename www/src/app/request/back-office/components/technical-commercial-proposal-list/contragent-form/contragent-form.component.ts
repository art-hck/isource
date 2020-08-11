import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ContragentList } from "../../../../../contragent/models/contragent-list";
import { shareReplay } from "rxjs/operators";
import { ContragentService } from "../../../../../contragent/services/contragent.service";
import { Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../../actions/technical-commercial-proposal.actions";
import { Request } from "../../../../common/models/request";
import CreateContragent = TechnicalCommercialProposals.CreateContragent;
import { ContragentShortInfo } from "../../../../../contragent/models/contragent-short-info";

@Component({
  selector: 'technical-commercial-proposal-contragent-form',
  templateUrl: 'contragent-form.component.html'
})
export class TechnicalCommercialProposalContragentFormComponent {
  @Input() request: Request;
  @Input() selectedContragents: ContragentShortInfo[];
  @Output() close = new EventEmitter();
  readonly form = this.fb.group({ supplier: [null, Validators.required] });
  readonly contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));

  constructor(
    private contragentService: ContragentService,
    private fb: FormBuilder,
    private store: Store,
  ) {}

  search(query: string, contragents: ContragentList[]) {
    return contragents.filter(c => c.shortName.toLowerCase().indexOf(query.toLowerCase()) >= 0 || c.inn.indexOf(query) >= 0);
  }

  contragentExists(contragent) {
    return this.selectedContragents.some(({id}) => id === contragent.id);
  }

  submit() {
    if (this.form.valid) {
      return this.store.dispatch(new CreateContragent(this.request.id, this.form.value));
    }
  }

  getContragentName = ({ shortName, fullName }: ContragentList) => shortName || fullName;
}

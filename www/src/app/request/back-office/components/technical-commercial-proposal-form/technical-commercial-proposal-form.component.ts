import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Request } from "../../../common/models/request";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { shareReplay } from "rxjs/operators";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalsService } from "../../services/technical-commercial-proposals.service";

@Component({
  selector: 'app-technical-commercial-proposal-form',
  templateUrl: './technical-commercial-proposal-form.component.html',
  styleUrls: ['./technical-commercial-proposal-form.component.scss'],
})
export class TechnicalCommercialProposalFormComponent implements OnInit {
  @Input() request: Request;
  @Input() technicalCommercialProposal: TechnicalCommercialProposal;
  @Input() closable = true;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() create = new EventEmitter<TechnicalCommercialProposal>();
  @Output() update = new EventEmitter<TechnicalCommercialProposal>();
  isLoading: boolean;
  form: FormGroup;
  contragents$: Observable<ContragentList[]>;

  get isEditing(): boolean {
    return !!this.technicalCommercialProposal;
  }

  constructor(
    private fb: FormBuilder,
    private contragentService: ContragentService,
    private technicalCommercialProposalsService: TechnicalCommercialProposalsService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      contragent: [this.defaultValue('supplierContragent', null), Validators.required],
    });

    this.contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));
  }

  submit(publish = true): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.form.disable();
    this.technicalCommercialProposalsService.create().subscribe(technicalCommercialProposal => {
      this.visibleChange.emit(false);
      this.isEditing ? this.update.emit(technicalCommercialProposal) : this.create.emit(technicalCommercialProposal);
    });

  }

  getContragentName = (contragent: ContragentList) => contragent.shortName || contragent.fullName;
  searchContragent = (query: string, contragents: ContragentList[]) => {
    return contragents.filter(
      c => c.shortName.toLowerCase().indexOf(query.toLowerCase()) >= 0 || c.inn.indexOf(query) >= 0);
  }

  defaultValue = (field: keyof TechnicalProposal, defaultValue: any = "") => this.technicalCommercialProposal && this.technicalCommercialProposal[field] || defaultValue;
}

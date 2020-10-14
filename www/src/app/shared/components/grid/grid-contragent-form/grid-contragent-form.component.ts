import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { FormBuilder, Validators } from "@angular/forms";
import { shareReplay } from "rxjs/operators";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { searchContragents } from "../../../helpers/search";

@Component({
  selector: 'grid-contragent-form',
  templateUrl: 'grid-contragent-form.component.html'
})
export class GridContragentFormComponent {
  @Input() excludedContragents: ContragentShortInfo[];
  @Output() close = new EventEmitter();
  @Output() add = new EventEmitter();
  readonly form = this.fb.group({ supplier: [null, Validators.required] });
  readonly contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));
  readonly searchContragents = searchContragents;

  constructor(private contragentService: ContragentService, private fb: FormBuilder) {}


  filterContragents(contragents: ContragentShortInfo[]): ContragentShortInfo[] {
    return contragents.filter(({id}) => !this.excludedContragents.some(({id: excluded_id}) => id === excluded_id));
  }
  contragentExists(contragent): boolean {
    return this.excludedContragents.some(({id}) => id === contragent.id);
  }

  submit() {
    if (this.form.invalid) { return; }
    this.add.emit(this.form.get('supplier').value);
  }

  getContragentName = ({ shortName, fullName }: ContragentShortInfo) => shortName || fullName;
}

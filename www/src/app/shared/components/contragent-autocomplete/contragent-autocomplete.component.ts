import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ContragentList } from "../../../contragent/models/contragent-list";
import { Observable, Subject } from "rxjs";
import { debounceTime, filter, map, publishReplay, refCount, tap } from "rxjs/operators";
import { ContragentService } from "../../../contragent/services/contragent.service";

@Component({
  selector: 'app-contragent-autocomplete',
  templateUrl: './contragent-autocomplete.component.html',
  styleUrls: ['./contragent-autocomplete.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ContragentAutocompleteComponent), multi: true }
  ]
})
export class ContragentAutocompleteComponent implements ControlValueAccessor {

  @Input() disabled: boolean;
  @Input() value: ContragentList[];
  @Input() multiple = false;
  @Input() minLength = 0;
  @Input() display = 10;
  @Input() debounceTime = 100;
  @Input() contragentsFullList: ContragentList[];

  public onTouched: (value: ContragentList[]) => void;
  public onInput = new Subject<string>();
  public onChange: (value: ContragentList[]) => void;
  public isOpen: boolean;
  public contragents$: Observable<ContragentList[]>;

  constructor(
    protected getContragentService: ContragentService,
  ) {

    // if (this.contragentsFullList && this.contragentsFullList.length === 0) {
    //   this.getContragentService.getContragentList().pipe(
    //     map(contragents => {
    //       this.contragentsFullList = contragents;
    //       console.log(this.contragentsFullList);
    //     }),
    //     publishReplay(1),
    //     refCount()
    //   );
    // }

    this.contragents$ = this.onInput.pipe(
      filter(value => value.length >= this.minLength),
      debounceTime(this.debounceTime),
      tap(() => this.isOpen = true),
      map(value => this.search(this.contragentsFullList, value, this.display)),
    );
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  writeValue(value: ContragentList[] | null): void {
    this.value = value;
  }

  search(contragents: ContragentList[], value: string, display: number): ContragentList[] {
    return contragents.filter(
      contragent => contragent.shortName.toLowerCase().indexOf(value.toLowerCase()) >= 0 || contragent.inn.indexOf(value) >= 0
    )
      .slice(0, display);
  }

  select(contragent: ContragentList) {
    this.isOpen = false;
    this.writeValue([...this.multiple && this.value ? this.value : [], contragent]);
    this.onChange(this.value);
  }
}

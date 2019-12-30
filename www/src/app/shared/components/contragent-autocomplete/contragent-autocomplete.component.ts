import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ContragentList } from "../../../contragent/models/contragent-list";
import { Observable, Subject } from "rxjs";
import { ContragentService } from "../../../contragent/services/contragent.service";
import { debounceTime, filter, flatMap, map, publishReplay, refCount, tap } from "rxjs/operators";

@Component({
  selector: 'app-contragent-autocomplete',
  templateUrl: './contragent-autocomplete.component.html',
  styleUrls: ['./contragent-autocomplete.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ContragentAutocompleteComponent), multi: true}
  ]
})
export class ContragentAutocompleteComponent implements ControlValueAccessor {

  @Input() disabled: boolean;
  @Input() value: ContragentList[];
  @Input() multiple = false;
  @Input() minLength = 0;
  @Input() display = 10;
  @Input() debounceTime = 100;

  public onTouched: (value: ContragentList[]) => void;
  public onInput = new Subject<string>();
  public onChange: (value: ContragentList[]) => void;
  public isOpen: boolean;
  // @TODO Получать с бэкенда не всех контрагентов, а сразу отфильтрованных
  public contragentsFullList$: Observable<ContragentList[]>;
  public contragents$: Observable<ContragentList[]>;

  constructor(private contragentService: ContragentService) {
    this.contragentsFullList$ = this.contragentService.getContragentList().pipe(publishReplay(1), refCount());
    this.contragents$ = this.onInput.pipe(
      filter(value => value.length >= this.minLength),
      debounceTime(this.debounceTime),
      tap(() => this.isOpen = true),
      flatMap(value => this.contragentsFullList$.pipe(map(
        contragents => this.search(contragents, value, this.display)
      )))
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

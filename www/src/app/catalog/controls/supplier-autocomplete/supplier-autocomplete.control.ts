import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ContragentService } from "../../../contragent/services/contragent.service";
import { Observable, Subject } from "rxjs";
import { debounceTime, filter, flatMap, map, publishReplay, refCount, tap } from "rxjs/operators";
import { ContragentList } from "../../../contragent/models/contragent-list";

@Component({
  selector: 'app-supplier-autocomplete',
  templateUrl: 'supplier-autocomplete.control.html',
  styleUrls: ['./supplier-autocomplete.control.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SupplierAutocompleteControlComponent), multi: true}
  ]
})

export class SupplierAutocompleteControlComponent implements ControlValueAccessor {

  public value: ContragentList[];
  public onTouched: (value: ContragentList[]) => void;
  public onInput = new Subject<string>();
  public onChange: (value: ContragentList[]) => void;
  public isOpen: boolean;
  public isDisabled: boolean;
  // @TODO Получать с бэкенда не всех контрагентов, а сразу отфильтрованных
  public contragentsFullList$: Observable<ContragentList[]>;
  public contragents$: Observable<ContragentList[]>;

  @Input() placeholder = "Введите имя контрагента";
  @Input() multiple = false;
  // Минимальное количество символов для начала поиска
  @Input() minLength = 0;
  @Input() inputValue = "";
  @Input() display = 10;
  @Input() debounceTime = 500;


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

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: ContragentList[] | null): void {
    this.value = value;
  }

  search(contragents: ContragentList[], value: string, display: number): ContragentList[] {
    return contragents.filter(
      contragent => contragent.shortName.toLowerCase().indexOf(value.toLowerCase()) > -1 || contragent.inn.indexOf(value) > -1
    )
      .slice(0, display);
  }

  delete(contragent: ContragentList) {
    this.writeValue(this.value.filter(_contragent => _contragent !== contragent));
    this.onChange(this.value);
  }

  select(contragent: ContragentList) {
    this.isOpen = false;
    this.inputValue = contragent.shortName;
    this.writeValue([...this.multiple && this.value ? this.value : [], contragent]);
    this.onChange(this.value);
  }
}

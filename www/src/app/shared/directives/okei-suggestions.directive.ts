import { Directive, Host, Input, OnInit } from '@angular/core';
import { OkeiService } from "../services/okei.service";
import { debounceTime, filter, flatMap, map, publishReplay, refCount, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Okei } from "../models/okei";
import { NgControl } from "@angular/forms";
import { UxgDropdownInputComponent } from "uxg";

@Directive({
  selector: '[appOkeiSuggestions]',
  exportAs: 'appOkeiSuggestions'
})
export class OkeiSuggestionsDirective implements OnInit {
  @Input() limit = 5;
  @Input() minLength = 1;
  @Input() valueChanges$: Observable<any>;
  okeiSuggestions$: Observable<Okei[]>;

  constructor(
    private okeiService: OkeiService,
    private ngControl: NgControl,
    @Host() private dropdownInputComponent: UxgDropdownInputComponent
  ) {}

  ngOnInit() {
    const okeiFullData$ = this.okeiService.getOkeiList().pipe(publishReplay(1), refCount());

    this.okeiSuggestions$ = this.ngControl.valueChanges.pipe(
      debounceTime(300),
      tap(value => {
        if (value.length < this.minLength) {
          this.dropdownInputComponent.toggle(false);
        }
      }),
      filter(value => value.length >= this.minLength),
      flatMap((value) => okeiFullData$.pipe(map(
        data => data.filter(({ name, symbol }) => {
          return name.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
            (symbol && symbol.toLowerCase().indexOf(value.toLowerCase()) >= 0);
        }).slice(0, this.limit)
      ))),
      filter(() => this.dropdownInputComponent.isCustomValue),
      tap(() => this.dropdownInputComponent.toggle(true))
    );
  }
}

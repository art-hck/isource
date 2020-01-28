import { Component, OnInit, Input, forwardRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Okei } from '../../models/okei';
import { OkeiService } from '../../services/okei.service';
import { Observable, Subject } from 'rxjs';
import { publishReplay, refCount, filter, debounceTime, tap, flatMap, map } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-okei-selector',
  templateUrl: './okei-selector.component.html',
  styleUrls: ['./okei-selector.component.scss'],
})
export class OkeiSelectorComponent implements OnInit {

  @Input() value: Okei|null = null;
  @Input() minLength = 0;
  @Input() debounceTime = 100;
  @Input() resultsCount = 10;

  @Output() change = new EventEmitter<Okei|null>();

  public isOpen = false;
  public onInputSubject = new Subject<string>();

  public okeiFullData$: Observable<Okei[]>;
  public okeiFiltredData$: Observable<Okei[]>;

  constructor(private okeiService: OkeiService) {
    this.okeiFullData$ = this.okeiService.getOkeiList().pipe(publishReplay(1), refCount());
    this.okeiFiltredData$ = this.onInputSubject.pipe(
      filter((value) => value.length >= this.minLength),
      debounceTime(this.debounceTime),
      tap(() => this.isOpen = true),
      flatMap((value) => {
        return this.okeiFullData$.pipe(map(
          data => this.search(data, value, this.resultsCount)
        ));
      })
    );
  }

  ngOnInit() {}

  search(items: Okei[], value: string, resultsCount: number): Okei[] {
    // TODO: 2020-01-28 Учитывать полное совпадение, поднимать такие результаты наверх
    const valueLowerCase = value.toLowerCase();
    let res = items.filter((item) => {
      return (
        item.name.toLowerCase().indexOf(valueLowerCase) >= 0 ||
        (
          item.symbol &&
          item.symbol.toLowerCase().indexOf(valueLowerCase) >= 0
        )
      );
    });
    return res.slice(0, resultsCount);
  }

  select(okei: Okei|null): void {
    this.isOpen = false;
    this.value = okei;
    this.change.emit(okei);
  }

  onInput(value: string): void {
    this.onInputSubject.next(value);
  }

}

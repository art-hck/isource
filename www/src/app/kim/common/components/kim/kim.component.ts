import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { DOCUMENT } from "@angular/common";

@Component({
  templateUrl: './kim.component.html',
  styleUrls: ['./kim.component.scss']
})
export class KimComponent implements AfterViewInit, OnDestroy {
  @ViewChild('menu') menu: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  ngAfterViewInit() {
    this.document.querySelector('.main-container').insertBefore(
      this.menu.nativeElement,
      this.document.querySelector('.content-container')
    );
  }

  ngOnDestroy() {
    this.menu.nativeElement.remove();
  }

}

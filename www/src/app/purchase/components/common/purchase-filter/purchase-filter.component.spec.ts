import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseFilterComponent } from './purchase-filter.component';

describe('FilterComponent', () => {
  let component: PurchaseFilterComponent;
  let fixture: ComponentFixture<PurchaseFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

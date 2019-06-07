import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTypeSelectorComponent } from './purchase-type-selector.component';

describe('TypeSelectorComponent', () => {
  let component: PurchaseTypeSelectorComponent;
  let fixture: ComponentFixture<PurchaseTypeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseTypeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

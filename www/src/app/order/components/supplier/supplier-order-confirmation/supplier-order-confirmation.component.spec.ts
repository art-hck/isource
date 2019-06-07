import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOrderConfirmationComponent } from './supplier-order-confirmation.component';

describe('SupplierOrderConfirmationComponent', () => {
  let component: SupplierOrderConfirmationComponent;
  let fixture: ComponentFixture<SupplierOrderConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierOrderConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierOrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

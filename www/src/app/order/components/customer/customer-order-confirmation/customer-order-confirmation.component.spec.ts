import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrderConfirmationComponent } from './customer-order-confirmation.component';

describe('CustomerOrderConfirmationComponent', () => {
  let component: CustomerOrderConfirmationComponent;
  let fixture: ComponentFixture<CustomerOrderConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOrderConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

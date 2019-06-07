import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFinanceComponent } from './order-finance.component';

describe('OrderFinanceComponent', () => {
  let component: OrderFinanceComponent;
  let fixture: ComponentFixture<OrderFinanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFinanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

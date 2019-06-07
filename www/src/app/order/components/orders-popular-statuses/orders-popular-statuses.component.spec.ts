import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPopularStatusesComponent } from './orders-popular-statuses.component';

describe('OrdersPopularStatusesComponent', () => {
  let component: OrdersPopularStatusesComponent;
  let fixture: ComponentFixture<OrdersPopularStatusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersPopularStatusesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersPopularStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

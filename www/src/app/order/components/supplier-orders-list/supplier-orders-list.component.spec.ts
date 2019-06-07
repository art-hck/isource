import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOrdersListComponent } from './supplier-orders-list.component';

describe('SupplierOrdersListComponent', () => {
  let component: SupplierOrdersListComponent;
  let fixture: ComponentFixture<SupplierOrdersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierOrdersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

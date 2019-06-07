import { TestBed, inject } from '@angular/core/testing';

import { OrdersStoreService } from './orders-store.service';

describe('OrdersStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdersStoreService]
    });
  });

  it('should be created', inject([OrdersStoreService], (service: OrdersStoreService) => {
    expect(service).toBeTruthy();
  }));
});

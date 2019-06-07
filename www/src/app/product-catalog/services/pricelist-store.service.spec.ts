import { TestBed, inject } from '@angular/core/testing';

import { PricelistStoreService } from './pricelist-store.service';

describe('PricelistStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PricelistStoreService]
    });
  });

  it('should be created', inject([PricelistStoreService], (service: PricelistStoreService) => {
    expect(service).toBeTruthy();
  }));
});

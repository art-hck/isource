import { TestBed, inject } from '@angular/core/testing';

import { CatalogProductsStoreService } from './catalog-products-store.service';

describe('CatalogProductsStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogProductsStoreService]
    });
  });

  it('should be created', inject([CatalogProductsStoreService], (service: CatalogProductsStoreService) => {
    expect(service).toBeTruthy();
  }));
});

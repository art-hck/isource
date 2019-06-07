import { TestBed, inject } from '@angular/core/testing';

import { DictionaryStoreService } from './dictionary-store.service';

describe('DictionaryStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DictionaryStoreService]
    });
  });

  it('should be created', inject([DictionaryStoreService], (service: DictionaryStoreService) => {
    expect(service).toBeTruthy();
  }));
});

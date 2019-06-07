import { PurchaseModule } from './purchase.module';

describe('PurchaseModule', () => {
  let purchaseModule: PurchaseModule;

  beforeEach(() => {
    purchaseModule = new PurchaseModule();
  });

  it('should create an instance', () => {
    expect(purchaseModule).toBeTruthy();
  });
});

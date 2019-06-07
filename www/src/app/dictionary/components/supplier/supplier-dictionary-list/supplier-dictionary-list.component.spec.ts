import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDictionaryListComponent } from './supplier-dictionary-list.component';

describe('SupplierDictionaryListComponent', () => {
  let component: SupplierDictionaryListComponent;
  let fixture: ComponentFixture<SupplierDictionaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierDictionaryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierDictionaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedItemsViewComponent } from './linked-items-view.component';

describe('LinkedItemsViewComponent', () => {
  let component: LinkedItemsViewComponent;
  let fixture: ComponentFixture<LinkedItemsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedItemsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedItemsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

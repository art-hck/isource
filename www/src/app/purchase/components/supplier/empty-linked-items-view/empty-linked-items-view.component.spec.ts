import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyLinkedItemsViewComponent } from './empty-linked-items-view.component';

describe('EmptyLinkedItemsViewComponent', () => {
  let component: EmptyLinkedItemsViewComponent;
  let fixture: ComponentFixture<EmptyLinkedItemsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyLinkedItemsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyLinkedItemsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

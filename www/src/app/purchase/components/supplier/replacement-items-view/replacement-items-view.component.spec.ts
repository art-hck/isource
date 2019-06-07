import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementItemsViewComponent } from './replacement-items-view.component';

describe('ReplacementItemsViewComponent', () => {
  let component: ReplacementItemsViewComponent;
  let fixture: ComponentFixture<ReplacementItemsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplacementItemsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacementItemsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

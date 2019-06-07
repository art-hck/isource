import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementItemViewComponent } from './replacement-item-view.component';

describe('ReplacementItemViewComponent', () => {
  let component: ReplacementItemViewComponent;
  let fixture: ComponentFixture<ReplacementItemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplacementItemViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacementItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

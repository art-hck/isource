import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertReplacementRequestComponent } from './alert-replacement-request.component';

describe('AlertReplacementRequestComponent', () => {
  let component: AlertReplacementRequestComponent;
  let fixture: ComponentFixture<AlertReplacementRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertReplacementRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertReplacementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

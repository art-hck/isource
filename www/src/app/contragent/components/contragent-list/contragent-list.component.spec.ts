import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContragentListComponent } from './contragent-list.component';

describe('ContragentListComponent', () => {
  let component: ContragentListComponent;
  let fixture: ComponentFixture<ContragentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContragentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContragentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

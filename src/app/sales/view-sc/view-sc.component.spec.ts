import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewScComponent } from './view-sc.component';

describe('ViewScComponent', () => {
  let component: ViewScComponent;
  let fixture: ComponentFixture<ViewScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewScComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

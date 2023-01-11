import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptDashboardComponent } from './opt-dashboard.component';

describe('OptDashboardComponent', () => {
  let component: OptDashboardComponent;
  let fixture: ComponentFixture<OptDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

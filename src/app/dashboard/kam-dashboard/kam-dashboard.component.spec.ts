import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KamDashboardComponent } from './kam-dashboard.component';

describe('KamDashboardComponent', () => {
  let component: KamDashboardComponent;
  let fixture: ComponentFixture<KamDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KamDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KamDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

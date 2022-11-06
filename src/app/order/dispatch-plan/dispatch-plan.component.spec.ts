import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchPlanComponent } from './dispatch-plan.component';

describe('DispatchPlanComponent', () => {
  let component: DispatchPlanComponent;
  let fixture: ComponentFixture<DispatchPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlaningFormComponent } from './order-planing-form.component';

describe('OrderPlaningFormComponent', () => {
  let component: OrderPlaningFormComponent;
  let fixture: ComponentFixture<OrderPlaningFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderPlaningFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPlaningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

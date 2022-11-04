import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlaningComponent } from './order-planing.component';

describe('OrderPlaningComponent', () => {
  let component: OrderPlaningComponent;
  let fixture: ComponentFixture<OrderPlaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderPlaningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPlaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

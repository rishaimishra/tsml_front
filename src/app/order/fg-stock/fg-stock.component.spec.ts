import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FgStockComponent } from './fg-stock.component';

describe('FgStockComponent', () => {
  let component: FgStockComponent;
  let fixture: ComponentFixture<FgStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FgStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FgStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

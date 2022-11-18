import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRfqComponent } from './confirm-rfq.component';

describe('ConfirmRfqComponent', () => {
  let component: ConfirmRfqComponent;
  let fixture: ComponentFixture<ConfirmRfqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmRfqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

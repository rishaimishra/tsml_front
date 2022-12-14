import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRfqListComponent } from './sales-rfq-list.component';

describe('SalesRfqListComponent', () => {
  let component: SalesRfqListComponent;
  let fixture: ComponentFixture<SalesRfqListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesRfqListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesRfqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

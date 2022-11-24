import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesResponsComponent } from './sales-respons.component';

describe('SalesResponsComponent', () => {
  let component: SalesResponsComponent;
  let fixture: ComponentFixture<SalesResponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesResponsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesResponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

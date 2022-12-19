import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoDetailsComponent } from './do-details.component';

describe('DoEntryComponent', () => {
  let component: DoDetailsComponent;
  let fixture: ComponentFixture<DoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

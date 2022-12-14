import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoEntryComponent } from './do-entry.component';

describe('DoEntryComponent', () => {
  let component: DoEntryComponent;
  let fixture: ComponentFixture<DoEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

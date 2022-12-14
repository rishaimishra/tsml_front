import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDoComponent } from './view-do.component';

describe('ViewDoComponent', () => {
  let component: ViewDoComponent;
  let fixture: ComponentFixture<ViewDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

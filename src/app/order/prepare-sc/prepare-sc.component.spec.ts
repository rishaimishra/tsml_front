import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareScComponent } from './prepare-sc.component';

describe('PrepareScComponent', () => {
  let component: PrepareScComponent;
  let fixture: ComponentFixture<PrepareScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepareScComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepareScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KamComponent } from './kam.component';

describe('KamComponent', () => {
  let component: KamComponent;
  let fixture: ComponentFixture<KamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareSoComponent } from './prepare-so.component';

describe('PrepareSoComponent', () => {
  let component: PrepareSoComponent;
  let fixture: ComponentFixture<PrepareSoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepareSoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepareSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

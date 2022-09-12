import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFRQComponent } from './edit-frq.component';

describe('EditFRQComponent', () => {
  let component: EditFRQComponent;
  let fixture: ComponentFixture<EditFRQComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFRQComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFRQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

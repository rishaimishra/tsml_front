import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDoComponent } from './edit-do.component';

describe('EditDoComponent', () => {
  let component: EditDoComponent;
  let fixture: ComponentFixture<EditDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

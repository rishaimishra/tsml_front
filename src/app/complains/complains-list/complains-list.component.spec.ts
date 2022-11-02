import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainsListComponent } from './complains-list.component';

describe('ComplainsListComponent', () => {
  let component: ComplainsListComponent;
  let fixture: ComponentFixture<ComplainsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplainsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplainsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

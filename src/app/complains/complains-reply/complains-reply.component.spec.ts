import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainsReplyComponent } from './complains-reply.component';

describe('ComplainsReplyComponent', () => {
  let component: ComplainsReplyComponent;
  let fixture: ComponentFixture<ComplainsReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplainsReplyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplainsReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

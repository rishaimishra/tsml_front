import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KamReplyComponent } from './kam-reply.component';

describe('KamReplyComponent', () => {
  let component: KamReplyComponent;
  let fixture: ComponentFixture<KamReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KamReplyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KamReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FerroChromeComponent } from './ferro-chrome.component';

describe('FerroChromeComponent', () => {
  let component: FerroChromeComponent;
  let fixture: ComponentFixture<FerroChromeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FerroChromeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FerroChromeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

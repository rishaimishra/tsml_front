import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChromeOreComponent } from './chrome-ore.component';

describe('ChromeOreComponent', () => {
  let component: ChromeOreComponent;
  let fixture: ComponentFixture<ChromeOreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChromeOreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChromeOreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

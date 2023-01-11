import { TestBed } from '@angular/core/testing';

import { OptGuard } from './opt.guard';

describe('OptGuard', () => {
  let guard: OptGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OptGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

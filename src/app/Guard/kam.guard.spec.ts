import { TestBed } from '@angular/core/testing';

import { KamGuard } from './kam.guard';

describe('KamGuard', () => {
  let guard: KamGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(KamGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CustGuard } from './cust.guard';

describe('CustGuard', () => {
  let guard: CustGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

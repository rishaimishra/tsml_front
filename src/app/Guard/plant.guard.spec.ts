import { TestBed } from '@angular/core/testing';

import { PlantGuard } from './plant.guard';

describe('PlantGuard', () => {
  let guard: PlantGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PlantGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

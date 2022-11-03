import { TestBed } from '@angular/core/testing';

import { ComplainsService } from './complains.service';

describe('ComplainsService', () => {
  let service: ComplainsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplainsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

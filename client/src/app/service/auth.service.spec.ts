import { TestBed } from '@angular/core/testing';

import { AUthService } from './auth.service';

describe('AUthService', () => {
  let service: AUthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AUthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { RadiusServiceService } from './radius-service.service';

describe('RadiusServiceService', () => {
  let service: RadiusServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadiusServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

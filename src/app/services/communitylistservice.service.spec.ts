import { TestBed } from '@angular/core/testing';

import { CommunitylistserviceService } from './communitylistservice.service';

describe('CommunitylistserviceService', () => {
  let service: CommunitylistserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunitylistserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

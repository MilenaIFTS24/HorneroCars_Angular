import { TestBed } from '@angular/core/testing';

import { AbmUserService } from './abm-user.service';

describe('AbmUserService', () => {
  let service: AbmUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbmUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { AbmSucursalesService } from './abm-sucursales.service';

describe('AbmSucursalesService', () => {
  let service: AbmSucursalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbmSucursalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

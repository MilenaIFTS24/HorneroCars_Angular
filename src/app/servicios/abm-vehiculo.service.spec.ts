import { TestBed } from '@angular/core/testing';

import { AbmVehiculoService } from './abm-vehiculo.service';

describe('AbmVehiculoService', () => {
  let service: AbmVehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbmVehiculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

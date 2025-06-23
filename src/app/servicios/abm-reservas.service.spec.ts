import { TestBed } from '@angular/core/testing';

import { AbmReservaService } from './abm-reservas.service';

describe('AbmReservasService', () => {
  let service: AbmReservaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbmReservaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { OficinasService } from './oficinas.service';

describe('OficinasService', () => {
  let service: OficinasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OficinasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

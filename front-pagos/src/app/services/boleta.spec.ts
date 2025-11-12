import { TestBed } from '@angular/core/testing';
import { BoletaService } from './boleta';

describe('Boleta', () => {
  let service: BoletaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoletaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ServicioGraficoService } from './servicio-grafico.service';

describe('ServicioGraficoService', () => {
  let service: ServicioGraficoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioGraficoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

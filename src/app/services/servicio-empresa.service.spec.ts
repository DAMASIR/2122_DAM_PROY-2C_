import { TestBed } from '@angular/core/testing';

import { ServicioEmpresaService } from './servicio-empresa.service';

describe('ServicioEmpresaService', () => {
  let service: ServicioEmpresaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioEmpresaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

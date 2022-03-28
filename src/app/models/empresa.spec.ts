import { Empresa } from './empresa';

describe('Empresa', () => {
  it('should create an instance', () => {
    expect(new Empresa('unaEmpresa', 'logo', 'sector', 'direccion', 'unaUrl', false)).toBeTruthy();
  });
});

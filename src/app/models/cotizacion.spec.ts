import { Cotizacion } from './cotizacion';

describe('Cotizacion', () => {
  it('should create an instance', () => {
    expect(new Cotizacion(1, 'today', 10)).toBeTruthy();
  });
});

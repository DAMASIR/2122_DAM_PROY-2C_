import { DataGrafico } from './data-grafico';

describe('DataGrafico', () => {
  it('should create an instance', () => {
    expect(new DataGrafico('unLabel', [1, 2, 3], ['hoy', 'manana', 'pasado'], 1)).toBeTruthy();
  });
});

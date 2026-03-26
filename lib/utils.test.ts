import { describe, it, expect } from 'vitest';
import { formatCurrencyFromCopper } from './utils';

describe('formatCurrencyFromCopper', () => {
  it('should correctly format 0 copper', () => {
    expect(formatCurrencyFromCopper(0)).toEqual({ gp: 0, sp: 0, cp: 0 });
  });

  it('should correctly format less than 10 copper', () => {
    expect(formatCurrencyFromCopper(7)).toEqual({ gp: 0, sp: 0, cp: 7 });
  });

  it('should correctly format less than 100 copper', () => {
    expect(formatCurrencyFromCopper(56)).toEqual({ gp: 0, sp: 5, cp: 6 });
  });

  it('should correctly format exactly 1 gold piece', () => {
    expect(formatCurrencyFromCopper(100)).toEqual({ gp: 1, sp: 0, cp: 0 });
  });

  it('should correctly format a complex amount', () => {
    expect(formatCurrencyFromCopper(1234)).toEqual({ gp: 12, sp: 3, cp: 4 });
  });
});

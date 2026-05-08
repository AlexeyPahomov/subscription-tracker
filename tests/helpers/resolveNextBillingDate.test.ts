/// <reference types="vitest/globals" />
import { resolveNextBillingDate } from '../../src/helpers/resolveNextBillingDate';

describe('resolveNextBillingDate', () => {
  it('shifts monthly date to nearest upcoming month', () => {
    const result = resolveNextBillingDate(
      new Date('2026-04-13T00:00:00.000Z'),
      'monthly',
      new Date('2026-05-08T12:00:00.000Z'),
    );

    expect(result.toISOString()).toBe('2026-05-13T00:00:00.000Z');
  });

  it('keeps date when it is already today or in the future', () => {
    const result = resolveNextBillingDate(
      new Date('2026-05-13T00:00:00.000Z'),
      'monthly',
      new Date('2026-05-13T20:00:00.000Z'),
    );

    expect(result.toISOString()).toBe('2026-05-13T00:00:00.000Z');
  });

  it('shifts yearly date to nearest upcoming year', () => {
    const result = resolveNextBillingDate(
      new Date('2024-03-01T00:00:00.000Z'),
      'yearly',
      new Date('2026-02-15T00:00:00.000Z'),
    );

    expect(result.toISOString()).toBe('2026-03-01T00:00:00.000Z');
  });

  it('shifts weekly date to nearest upcoming week', () => {
    const result = resolveNextBillingDate(
      new Date('2026-05-01T00:00:00.000Z'),
      'weekly',
      new Date('2026-05-08T10:00:00.000Z'),
    );

    expect(result.toISOString()).toBe('2026-05-08T00:00:00.000Z');
  });

  it('shifts quarterly date by three-month periods', () => {
    const result = resolveNextBillingDate(
      new Date('2026-01-13T00:00:00.000Z'),
      'quarterly',
      new Date('2026-05-08T10:00:00.000Z'),
    );

    expect(result.toISOString()).toBe('2026-07-13T00:00:00.000Z');
  });
});

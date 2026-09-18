import { describe, it, expect } from 'vitest';
import { evaluateStoreOpenStatus, validateMinOrderAmount } from '@/core/logic/businessRules';
import { restaurantConfig } from '@/config/restaurant.config';

describe('Business Rules Engine — evaluateStoreOpenStatus', () => {
  const baseConfig = {
    ...restaurantConfig.business,
    openingHours: {
      open: '11:00',
      close: '23:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  };

  it('returns isOpen: true during normal open hours (e.g. 14:30)', () => {
    // Wednesday 14:30
    const testDate = new Date('2026-09-16T14:30:00');
    const result = evaluateStoreOpenStatus(baseConfig, testDate);

    expect(result.isOpen).toBe(true);
    expect(result.currentTime).toBe('14:30');
  });

  it('returns isOpen: false before opening hours (e.g. 09:15)', () => {
    // Wednesday 09:15
    const testDate = new Date('2026-09-16T09:15:00');
    const result = evaluateStoreOpenStatus(baseConfig, testDate);

    expect(result.isOpen).toBe(false);
    expect(result.nextOpenTime).toBe('11:00');
  });

  it('returns isOpen: false after closing hours (e.g. 23:45)', () => {
    // Wednesday 23:45
    const testDate = new Date('2026-09-16T23:45:00');
    const result = evaluateStoreOpenStatus(baseConfig, testDate);

    expect(result.isOpen).toBe(false);
  });

  it('handles custom closed days (e.g. closed on Mondays)', () => {
    const configWithoutMonday = {
      ...baseConfig,
      openingHours: {
        ...baseConfig.openingHours,
        days: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    };

    // Monday 15:00
    const mondayDate = new Date('2026-09-14T15:00:00');
    const result = evaluateStoreOpenStatus(configWithoutMonday, mondayDate);

    expect(result.isOpen).toBe(false);
    expect(result.currentDay).toBe('Mon');
  });

  it('handles overnight shifts (e.g. 19:00 to 02:00 next day)', () => {
    const overnightConfig = {
      ...baseConfig,
      openingHours: {
        open: '19:00',
        close: '02:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    };

    // 01:30 AM (should be open)
    const earlyMorningDate = new Date('2026-09-16T01:30:00');
    expect(evaluateStoreOpenStatus(overnightConfig, earlyMorningDate).isOpen).toBe(true);

    // 21:00 PM (should be open)
    const nightDate = new Date('2026-09-16T21:00:00');
    expect(evaluateStoreOpenStatus(overnightConfig, nightDate).isOpen).toBe(true);

    // 05:00 AM (should be closed)
    const dawnDate = new Date('2026-09-16T05:00:00');
    expect(evaluateStoreOpenStatus(overnightConfig, dawnDate).isOpen).toBe(false);
  });
});

describe('Business Rules Engine — validateMinOrderAmount', () => {
  it('approves orders meeting or exceeding minOrderAmount', () => {
    const resultExact = validateMinOrderAmount(15.0, 15.0);
    expect(resultExact.isValid).toBe(true);
    expect(resultExact.amountMissing).toBe(0);

    const resultHigher = validateMinOrderAmount(24.5, 15.0);
    expect(resultHigher.isValid).toBe(true);
    expect(resultHigher.amountMissing).toBe(0);
  });

  it('rejects orders below minOrderAmount and calculates missing amount', () => {
    const result = validateMinOrderAmount(10.5, 15.0);
    expect(result.isValid).toBe(false);
    expect(result.currentAmount).toBe(10.5);
    expect(result.minAmount).toBe(15.0);
    expect(result.amountMissing).toBe(4.5);
  });

  it('handles 0 minOrderAmount gracefully', () => {
    const result = validateMinOrderAmount(5.0, 0);
    expect(result.isValid).toBe(true);
    expect(result.amountMissing).toBe(0);
  });
});

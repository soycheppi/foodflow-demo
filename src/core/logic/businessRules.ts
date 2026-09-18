import { RestaurantConfig } from '@/config/restaurant.config';

export interface StoreScheduleStatus {
  readonly isOpen: boolean;
  readonly nextOpenTime?: string;
  readonly currentDay: string;
  readonly currentTime: string;
}

export interface MinOrderValidationResult {
  readonly isValid: boolean;
  readonly currentAmount: number;
  readonly minAmount: number;
  readonly amountMissing: number;
}

const DAY_MAP: readonly string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function evaluateStoreOpenStatus(
  businessConfig: RestaurantConfig['business'],
  referenceDate: Date = new Date()
): StoreScheduleStatus {
  const { openingHours } = businessConfig;
  const dayIndex = referenceDate.getDay();
  const currentDay = DAY_MAP[dayIndex];

  const currentHours = referenceDate.getHours().toString().padStart(2, '0');
  const currentMinutes = referenceDate.getMinutes().toString().padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  const isConfiguredDay = openingHours.days.some(
    (d) => d.toLowerCase() === currentDay.toLowerCase()
  );

  if (!isConfiguredDay) {
    return {
      isOpen: false,
      nextOpenTime: `${openingHours.days[0]} ${openingHours.open}`,
      currentDay,
      currentTime,
    };
  }

  const currentTotalMinutes = parseTimeToMinutes(currentTime);
  const openTotalMinutes = parseTimeToMinutes(openingHours.open);
  const closeTotalMinutes = parseTimeToMinutes(openingHours.close);

  if (openTotalMinutes < closeTotalMinutes) {
    const isOpen = currentTotalMinutes >= openTotalMinutes && currentTotalMinutes < closeTotalMinutes;
    return {
      isOpen,
      nextOpenTime: !isOpen && currentTotalMinutes < openTotalMinutes ? openingHours.open : undefined,
      currentDay,
      currentTime,
    };
  }

  const isOpen = currentTotalMinutes >= openTotalMinutes || currentTotalMinutes < closeTotalMinutes;
  return {
    isOpen,
    nextOpenTime: !isOpen ? openingHours.open : undefined,
    currentDay,
    currentTime,
  };
}

export function validateMinOrderAmount(
  subtotal: number,
  minOrderAmount: number
): MinOrderValidationResult {
  const safeMin = Math.max(0, minOrderAmount);
  const safeSubtotal = Math.max(0, subtotal);
  const isValid = safeSubtotal >= safeMin;
  const amountMissing = isValid ? 0 : Math.round((safeMin - safeSubtotal) * 100) / 100;

  return {
    isValid,
    currentAmount: safeSubtotal,
    minAmount: safeMin,
    amountMissing,
  };
}

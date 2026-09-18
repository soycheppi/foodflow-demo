import { describe, it, expect } from 'vitest';
import {
  checkoutStateReducer,
  canProceedToDispatch,
  CheckoutState,
} from '@/core/logic/checkoutStateMachine';

describe('Checkout State Machine & Flow Engine', () => {
  it('transitions from IDLE to VALIDATING_RULES upon validation request', () => {
    const nextState = checkoutStateReducer('IDLE', { type: 'VALIDATE_REQUESTED' });
    expect(nextState).toBe('VALIDATING_RULES');
  });

  it('transitions to READY_TO_CONFIRM when validation passes', () => {
    const nextState = checkoutStateReducer('VALIDATING_RULES', { type: 'VALIDATION_PASSED' });
    expect(nextState).toBe('READY_TO_CONFIRM');
  });

  it('prevents DISPATCHING if state is not READY_TO_CONFIRM', () => {
    const state: CheckoutState = 'IDLE';
    const nextState = checkoutStateReducer(state, { type: 'DISPATCH_REQUESTED' });
    expect(nextState).toBe('IDLE'); // Blocked!
  });

  it('allows DISPATCHING when in READY_TO_CONFIRM state', () => {
    const nextState = checkoutStateReducer('READY_TO_CONFIRM', { type: 'DISPATCH_REQUESTED' });
    expect(nextState).toBe('DISPATCHING');
  });

  it('completes order only from DISPATCHING state', () => {
    const completedState = checkoutStateReducer('DISPATCHING', { type: 'DISPATCH_CONFIRMED' });
    expect(completedState).toBe('ORDER_COMPLETED');
  });

  it('evaluates dispatch eligibility accurately based on operational invariants', () => {
    // Valid case
    expect(
      canProceedToDispatch({
        isStoreOpen: true,
        isMinOrderMet: true,
        hasItems: true,
        isFormValid: true,
      })
    ).toBe(true);

    // Below minimum order
    expect(
      canProceedToDispatch({
        isStoreOpen: true,
        isMinOrderMet: false,
        hasItems: true,
        isFormValid: true,
      })
    ).toBe(false);

    // Form invalid
    expect(
      canProceedToDispatch({
        isStoreOpen: true,
        isMinOrderMet: true,
        hasItems: true,
        isFormValid: false,
      })
    ).toBe(false);
  });
});

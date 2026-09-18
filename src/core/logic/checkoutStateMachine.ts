export type CheckoutState =
  | 'IDLE'
  | 'VALIDATING_RULES'
  | 'READY_TO_CONFIRM'
  | 'DISPATCHING'
  | 'ORDER_COMPLETED';

export interface CheckoutValidationContext {
  readonly isStoreOpen: boolean;
  readonly isMinOrderMet: boolean;
  readonly hasItems: boolean;
  readonly isFormValid: boolean;
}

export interface CheckoutMachineAction {
  type:
    | 'VALIDATE_REQUESTED'
    | 'VALIDATION_PASSED'
    | 'VALIDATION_FAILED'
    | 'DISPATCH_REQUESTED'
    | 'DISPATCH_CONFIRMED'
    | 'RESET';
}

export function checkoutStateReducer(
  state: CheckoutState,
  action: CheckoutMachineAction
): CheckoutState {
  switch (action.type) {
    case 'VALIDATE_REQUESTED':
      return 'VALIDATING_RULES';

    case 'VALIDATION_PASSED':
      return 'READY_TO_CONFIRM';

    case 'VALIDATION_FAILED':
      return 'IDLE';

    case 'DISPATCH_REQUESTED':
      if (state === 'READY_TO_CONFIRM') {
        return 'DISPATCHING';
      }
      return state;

    case 'DISPATCH_CONFIRMED':
      if (state === 'DISPATCHING') {
        return 'ORDER_COMPLETED';
      }
      return state;

    case 'RESET':
      return 'IDLE';

    default:
      return state;
  }
}

export function canProceedToDispatch(context: CheckoutValidationContext): boolean {
  return context.hasItems && context.isFormValid && context.isMinOrderMet;
}
